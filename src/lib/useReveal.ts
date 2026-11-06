import { useEffect } from 'react';

/**
 * [data-reveal] 요소가 화면에 들어오면 .is-in 을 붙여 페이드인.
 * 모바일 앱 내장 화면처럼 IntersectionObserver 가 동작하지 않거나
 * 페이지 전체 높이로 펼쳐 보여주는 환경에서도 내용이 숨겨진 채 남지 않도록
 * '현재 화면(프레임) 안에 있는 요소 즉시 표시' + 스크롤 확인을 함께 사용.
 */
export function useRevealAll() {
  useEffect(() => {
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const show = (el: Element) => el.classList.add('is-in');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending().forEach(show);
      return;
    }

    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const el of pending()) {
        const r = el.getBoundingClientRect();
        if (r.top < vh - Math.min(60, vh * 0.06) && r.bottom > 0) show(el);
      }
    };

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { show(e.target); io?.unobserve(e.target); }
        }),
        { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
      );
      pending().forEach((el) => io!.observe(el));
    }

    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
    const t = window.setTimeout(check, 600);
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);
}
