import { useEffect, useRef } from 'react';
import { CONFIG } from '../config';
import { copyText } from '../lib/clipboard';
import { preloadKakao, shareKakao, siteUrl } from '../lib/kakao';
import { useToast } from '../lib/toast';
import SmartImage from './SmartImage';
import { KakaoIcon, LinkIcon } from './Icons';

export default function Closing() {
  const toast = useToast();
  const ref = useRef<HTMLElement>(null);

  // 공유 버튼 근처에 오면 카카오 SDK 미리 로드
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { preloadKakao(); io.disconnect(); }
    }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pageUrl = () => (CONFIG.share.siteUrl ? siteUrl() + '/' : window.location.href.split('#')[0]);

  const copyLink = async () => {
    const ok = await copyText(pageUrl());
    if (ok) toast('링크가 복사되었습니다.');
    else window.prompt('아래 주소를 길게 눌러 복사해 주세요.', pageUrl());
  };

  const kakao = async () => {
    const r = await shareKakao();
    if (r === 'kakao') return;
    // 카카오 키 미설정/실패 → 기기 공유창 → 링크 복사
    if (navigator.share) {
      try {
        await navigator.share({ title: CONFIG.share.title, text: CONFIG.share.description, url: pageUrl() });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return;
      }
    }
    await copyLink();
  };

  return (
    <section className="section section--closing" ref={ref} aria-label="감사 인사 및 공유">
      <div className="closing__photo" data-reveal>
        <SmartImage src={CONFIG.finalPhoto} alt={`${CONFIG.baby.name} 사진`} />
      </div>
      <p className="closing__en" data-reveal>Thank you</p>
      <p className="closing__text" data-reveal>
        {CONFIG.texts.thanks}
      </p>
      <p className="closing__sign" data-reveal>{CONFIG.texts.thanksSign}</p>
      <div className="closing__share" data-reveal>
        <button type="button" className="btn btn--solid" onClick={kakao}>
          <KakaoIcon /> 카카오톡으로 공유하기
        </button>
        <button type="button" className="btn btn--outline" onClick={copyLink}>
          <LinkIcon /> 링크 복사하기
        </button>
      </div>
      <footer className="footer">
        <p>{CONFIG.baby.nameEn}&rsquo;s 1st Birthday</p>
      </footer>
    </section>
  );
}
