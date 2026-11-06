import { useEffect, useId, useState } from 'react';
import { TITLE } from '../generated/titlePaths';

/**
 * "Chaei's 1st Birthday" 손글씨 애니메이션
 * - fill: 글자 윤곽(브러시 서체) SVG path
 * - mask: 글자의 중심선(필기 획 순서) path 를 stroke-dashoffset 으로 그려가며
 *         채워진 글자를 획 방향대로 드러냄  → 실제로 써지는 듯한 효과
 * - 완료 후 마스크를 걷어 글자를 또렷하게 고정
 */
export default function HandwrittenTitle({ start = true, delay = 0.25 }: { start?: boolean; delay?: number }) {
  const id = useId().replace(/:/g, '');
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce || !start) return;
    const t = window.setTimeout(() => setDone(true), (delay + TITLE.total + 0.15) * 1000);
    return () => window.clearTimeout(t);
  }, [start, delay, reduce]);

  return (
    <svg
      className={`hw-title${start ? ' is-writing' : ''}${done ? ' is-done' : ''}`}
      viewBox={TITLE.viewBox}
      role="img"
      aria-label={TITLE.text.join(' ')}
      preserveAspectRatio="xMidYMid meet"
    >
      {!done && (
        <defs>
          <mask id={`hw-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={TITLE.width} height={TITLE.height}>
            {TITLE.strokes.map((s, i) => (
              <path
                key={i}
                d={s.d}
                className="hw-stroke"
                style={
                  {
                    strokeWidth: s.w,
                    strokeDasharray: `${s.len} ${s.len}`,
                    strokeDashoffset: s.len,
                    animationDuration: `${s.dur}s`,
                    animationDelay: `${s.delay + delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </mask>
        </defs>
      )}
      <g className="hw-fill" mask={done ? undefined : `url(#hw-${id})`}>
        {TITLE.fill.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
