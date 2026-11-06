import { useEffect, useRef } from 'react';

/** 은은한 눈 내리는 효과 (canvas, 화면 밖/백그라운드 탭에서는 정지) */
export default function Snow({ density = 34 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, visible = true, last = 0;

    type F = { x: number; y: number; r: number; vy: number; vx: number; ph: number; a: number };
    let flakes: F[] = [];
    const make = (initial: boolean): F => ({
      x: Math.random() * W,
      y: initial ? Math.random() * H : -10,
      r: 0.8 + Math.random() * 2.1,
      vy: 12 + Math.random() * 22,
      vx: -4 + Math.random() * 8,
      ph: Math.random() * Math.PI * 2,
      a: 0.35 + Math.random() * 0.45,
    });
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(density * Math.min(1.4, (W * H) / (430 * 820)));
      flakes = Array.from({ length: reduce ? Math.round(n / 2) : n }, () => make(true));
      if (reduce) draw(0);
    };
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        if (dt) {
          f.ph += dt * 0.9;
          f.y += f.vy * dt;
          f.x += (f.vx + Math.sin(f.ph) * 9) * dt;
          if (f.y > H + 6) Object.assign(f, make(false));
          if (f.x < -6) f.x = W + 6; else if (f.x > W + 6) f.x = -6;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        // 흰 배경에서도 보이도록 아주 옅은 회색 테두리 느낌
        ctx.fillStyle = `rgba(214,212,216,${f.a})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.x - f.r * 0.2, f.y - f.r * 0.2, f.r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.fill();
      }
    };
    const loop = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const play = () => { if (!raf && visible && !document.hidden && !reduce) { last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    ro?.observe(cv);
    if (!ro) window.addEventListener('resize', resize);
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); })
      : null;
    io?.observe(cv);
    const vis = () => (document.hidden ? stop() : play());
    document.addEventListener('visibilitychange', vis);
    play();
    return () => { stop(); ro?.disconnect(); window.removeEventListener('resize', resize); io?.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [density]);

  return <canvas ref={ref} className="snow" aria-hidden="true" />;
}
