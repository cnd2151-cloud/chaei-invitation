import { useState } from 'react';
import { CONFIG } from '../config';
import { copyText } from '../lib/clipboard';
import { useToast } from '../lib/toast';
import SectionTitle from './SectionTitle';
import { CopyIcon } from './Icons';
import { asset } from '../lib/asset';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

/** 앱 스킴 실행 → 앱이 없으면 일정 시간 뒤 대체 주소로 이동 */
function openApp(scheme: string, fallback: string) {
  let left = false;
  const onHide = () => { if (document.hidden) left = true; };
  document.addEventListener('visibilitychange', onHide);
  window.location.href = scheme;
  window.setTimeout(() => {
    document.removeEventListener('visibilitychange', onHide);
    if (!left && !document.hidden) window.location.href = fallback;
  }, 1600);
}

export default function Location() {
  const { event, directions } = CONFIG;
  const toast = useToast();
  const [mapOn, setMapOn] = useState(false);
  const q = encodeURIComponent(event.mapQuery);
  const hasXY = Boolean(event.lat && event.lng);

  const naver = `https://map.naver.com/p/search/${q}`;
  const kakao = hasXY
    ? `https://map.kakao.com/link/to/${encodeURIComponent(event.venue)},${event.lat},${event.lng}`
    : `https://map.kakao.com/link/search/${q}`;

  const tmap = () => {
    if (!isMobile()) {
      toast('티맵은 모바일에서 이용할 수 있어요.');
      return;
    }
    const scheme = hasXY
      ? `tmap://route?goalname=${encodeURIComponent(event.venue)}&goalx=${event.lng}&goaly=${event.lat}`
      : `tmap://search?name=${q}`;
    const store = isIOS()
      ? 'https://apps.apple.com/kr/app/id431589174'
      : 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku';
    openApp(scheme, store);
  };

  const copyAddr = async () => {
    const ok = await copyText([event.address, event.addressDetail].filter(Boolean).join(' '));
    toast(ok ? '주소가 복사되었습니다.' : '복사에 실패했어요. 주소를 길게 눌러 복사해 주세요.');
  };

  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(event.mapEmbedQuery)}&z=16&hl=ko&output=embed`;

  return (
    <section className="section section--location" aria-labelledby="t-loc">
      <SectionTitle en="LOCATION" ko="오시는 길" id="t-loc" />
      <div className="loc__info" data-reveal>
        <p className="loc__venue">{event.venue}</p>
        <p className="loc__addr">
          {event.address}
          {event.addressDetail && <span className="loc__detail">{event.addressDetail}</span>}
        </p>
        <button type="button" className="chip" onClick={copyAddr}>
          <CopyIcon /> 주소 복사
        </button>
        <p className="loc__date">{event.dateText}</p>
      </div>

      <div className="loc__map" data-reveal>
        {event.mapImage ? (
          <a className="loc__map-img" href={naver} target="_blank" rel="noopener noreferrer" aria-label={`${event.venue} 지도 크게 보기`}>
            <img src={asset(event.mapImage)} alt={`${event.venue} 약도`} />
          </a>
        ) : __PREVIEW__ ? (
          <div className="loc__map-cover is-static">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span>지도는 배포된 초대장에서 표시됩니다</span>
            <small>아래 버튼으로 지도 앱을 열 수 있어요</small>
          </div>
        ) : mapOn ? (
          <iframe title={`${event.venue} 지도`} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <button type="button" className="loc__map-cover" onClick={() => setMapOn(true)}>
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span>터치하여 지도 보기</span>
          </button>
        )}
      </div>

      <div className="loc__nav" data-reveal>
        <a className="nav-btn" href={naver} target="_blank" rel="noopener noreferrer">
          <i className="nav-btn__logo is-naver" aria-hidden="true">N</i>네이버 지도
        </a>
        <a className="nav-btn" href={kakao} target="_blank" rel="noopener noreferrer">
          <i className="nav-btn__logo is-kakao" aria-hidden="true">K</i>카카오맵
        </a>
        <button type="button" className="nav-btn" onClick={tmap}>
          <i className="nav-btn__logo is-tmap" aria-hidden="true">T</i>티맵
        </button>
      </div>

      <dl className="loc__guide" data-reveal>
        <div>
          <dt>대중교통</dt>
          <dd>{directions.transit}</dd>
        </div>
        <div>
          <dt>자가용</dt>
          <dd>{directions.parking}</dd>
        </div>
      </dl>
    </section>
  );
}
