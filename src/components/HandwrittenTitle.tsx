import { useEffect, useRef, useState } from 'react';
import { TITLE } from '../generated/titlePaths';
import { canStrokeReveal, runStrokeReveal } from '../lib/strokeReveal';

/**
 * "Chaei's 1st Birthday" 손글씨 애니메이션
 * - 글자 윤곽(브러시 서체)을, 글자의 중심선(필기 획 순서)이 지나간 자리만 보이게 그려
 *   실제로 펜으로 써 내려가는 효과. (Chaei's → 1st Birthday, 약 1.9초)
 * - 그리는 동안은 캔버스(모든 브라우저 동일 동작), 끝나면 또렷한 SVG 글씨로 고정.
 * - 캔버스를 쓸 수 없는 환경이면 완성된 글씨를 바로 표시.
 */
export default function HandwrittenTitle({ start = true, delay = 0.25 }: { start?: boolean; delay?: number }) {
  const [phase, setPhase] = useState<'wait' | 'drawing' | 'done'>(() => (canStrokeReveal() ? 'wait' : 'done'));
  const canvas = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!start || phase !== 'wait') return;
    const [x, y, w, h] = TITLE.viewBox.split(' ').map(Number);
    const ink = getComputedStyle(svg.current!.querySelector('.hw-fill')!).fill || '#1d1b1b';
    // 두 줄을 하나의 경로로 합쳐 한 번에 채움 ('source-in' 은 채울 때마다 바깥을 지우므로 나눠 채우면 앞 줄이 사라짐)
    const fill = new Path2D(TITLE.fill.join(' '));
    setPhase('drawing');
    let stop = () => {};
    try {
      stop = runStrokeReveal(
        canvas.current!,
        { x, y, w, h },
        [
          {
            strokes: TITLE.strokes,
            paint: (ctx) => {
              ctx.fillStyle = ink;
              ctx.fill(fill);
            },
          },
        ],
        { delay, onDone: () => setPhase('done') },
      );
    } catch {
      setPhase('done');
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <span className={`hw-wrap is-${phase}`}>
      <svg
        ref={svg}
        className="hw-title"
        viewBox={TITLE.viewBox}
        role="img"
        aria-label={TITLE.text.join(' ')}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="hw-fill">
          {TITLE.fill.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
      {phase !== 'done' && <canvas ref={canvas} className="hw-canvas" aria-hidden="true" />}
    </span>
  );
}
