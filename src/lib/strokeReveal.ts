/**
 * 손글씨 획 드러내기 엔진 (캔버스)
 * ------------------------------------------------------------
 * 이전에는 SVG <mask> 안의 획을 CSS 애니메이션으로 그렸는데, iOS(WebKit: 사파리·카카오톡·
 * Claude 앱 등 아이폰/아이패드의 모든 브라우저)는 마스크 안쪽이 애니메이션으로 바뀌어도
 * 화면을 다시 그리지 않아 글씨가 '써지는 과정' 없이 끝에 한 번에 나타났습니다.
 * 캔버스는 매 프레임 직접 그리므로 모든 브라우저에서 같은 모습으로 동작합니다.
 *
 * 매 프레임, 레이어마다:
 *   ① 지금까지 진행된 만큼 획(중심선)을 굵은 선으로 그림  → 마스크
 *   ② 'source-in' 합성으로 실제 글자/손그림을 그 위에 그림 → 획이 지나간 자리만 보임
 */
export type Stroke = { d: string; len: number; w: number; delay: number; dur: number };
export type RevealLayer = {
  strokes: readonly Stroke[];
  /** 드러낼 내용(글자 윤곽·손그림 이미지)을 viewBox 좌표로 그림 */
  paint: (ctx: CanvasRenderingContext2D) => void;
};
type View = { x: number; y: number; w: number; h: number };

/** 원래 CSS 의 cubic-bezier(0.45,0.05,0.55,0.95) 와 거의 같은 곡선 */
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

export const canStrokeReveal = () => {
  try {
    const c = document.createElement('canvas').getContext('2d');
    return !!c && typeof Path2D !== 'undefined' && typeof c.setLineDash === 'function';
  } catch {
    return false;
  }
};

/**
 * @returns 정리 함수. 끝나면 onDone 호출.
 */
export function runStrokeReveal(
  canvas: HTMLCanvasElement,
  view: View,
  layers: RevealLayer[],
  opts: { delay?: number; onDone?: () => void } = {},
) {
  const ctx = canvas.getContext('2d')!;
  const scratch = document.createElement('canvas');
  const sctx = scratch.getContext('2d')!;
  const parsed = layers.map((l) => ({ ...l, paths: l.strokes.map((s) => new Path2D(s.d)) }));
  const end = Math.max(...layers.flatMap((l) => l.strokes.map((s) => s.delay + s.dur)));
  const delay = opts.delay ?? 0;
  let raf = 0;
  let t0 = 0;
  let stopped = false;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(r.width * dpr));
    const H = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = scratch.width = W;
      canvas.height = scratch.height = H;
    }
    return { W, H, sx: W / view.w, sy: H / view.h };
  };

  const frame = (now: number) => {
    if (stopped) return;
    if (!t0) t0 = now;
    const t = (now - t0) / 1000 - delay;
    const { W, H, sx, sy } = size();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const l of parsed) {
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      sctx.clearRect(0, 0, W, H);
      sctx.setTransform(sx, 0, 0, sy, -view.x * sx, -view.y * sy);
      sctx.lineCap = 'round';
      sctx.lineJoin = 'round';
      sctx.strokeStyle = '#000';
      let any = false;
      l.strokes.forEach((s, i) => {
        const p = s.dur > 0 ? Math.min(1, Math.max(0, (t - s.delay) / s.dur)) : t >= s.delay ? 1 : 0;
        if (p <= 0) return;
        any = true;
        sctx.lineWidth = s.w;
        sctx.setLineDash([s.len, s.len]);
        sctx.lineDashOffset = s.len * (1 - ease(p));
        sctx.stroke(l.paths[i]);
      });
      if (!any) continue;
      sctx.setLineDash([]);
      sctx.globalCompositeOperation = 'source-in';
      l.paint(sctx);
      ctx.drawImage(scratch, 0, 0);
    }
    if (t >= end) {
      opts.onDone?.();
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
  };
}
