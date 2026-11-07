import { useEffect } from 'react';

/**
 * 스크롤 등장 애니메이션: [data-reveal] 요소가 화면에 들어오면 .is-in 을 붙여 서서히 나타냄.
 *
 * - 기본: IntersectionObserver (iOS 사파리·카카오톡 인앱·안드로이드·PC 모두 지원).
 *   앱이 초대장을 프레임 안에 통째로 펼쳐 보여주는 경우에도 실제 '휴대폰 화면'을 기준으로 판단.
 * - 대체: 관찰 기능이 없거나 1.2초 안에 아무 응답이 없는 환경에서만 스크롤 위치로 직접 확인.
 *   (이전 버전은 이 대체 확인을 항상 같이 돌려, 펼쳐 보여주는 환경에서 모든 섹션이
 *    처음부터 한꺼번에 나타나 애니메이션이 보이지 않았음)
 */
export function useRevealAll() {
  useEffect(() => {
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const show = (el: Element) => el.classList.add('is-in');
    let fallbackOn = false;
    let raf = 0;

    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const el of pending()) {
        const r = el.getBoundingClientRect();
        if (r.top < vh - Math.min(60, vh * 0.06) && r.bottom > 0) show(el);
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    const startFallback = () => {
      if (fallbackOn) return;
      fallbackOn = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      check();
    };

    let io: IntersectionObserver | null = null;
    let heard = false;
    let t = 0;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          heard = true;
          entries.forEach((e) => {
            if (e.isIntersecting) { show(e.target); io?.unobserve(e.target); }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
      );
      pending().forEach((el) => io!.observe(el));
      // 관찰을 시작하면 브라우저는 곧바로 한 번 응답해야 함. 응답이 없으면 고장난 환경으로 보고 대체.
      t = window.setTimeout(() => { if (!heard) startFallback(); }, 1200);
    } else {
      startFallback();
    }

    return () => {
      io?.disconnect();
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
