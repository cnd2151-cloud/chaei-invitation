import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import { CONFIG } from '../config';
import { CANVAS, DOODLES, LAYER_BOX, LAYER_ORDER } from '../generated/layers';
import HandwrittenTitle from './HandwrittenTitle';
import Snow from './Snow';

const ALT: Record<string, string> = {
  baby: `${CONFIG.baby.name} 사진`,
  balloon: '',
  bear: '',
  cupcake: '',
};

/**
 * 바닥 그림자 (메인 비주얼 기준 %, 중심 x/y · 너비 · 높이 · 진하기)
 * 위치 조정이 필요하면 숫자만 바꾸세요.
 */
const SHADOWS = [
  { name: 'baby', x: 43.5, y: 97.2, w: 46, h: 6.5, o: 1 },
  { name: 'bear', x: 20.5, y: 89.2, w: 27, h: 5, o: 0.85 },
  { name: 'cupcake', x: 72.5, y: 95.2, w: 19, h: 4.2, o: 0.75 },
];

/** 손그림 장식: 원본 손그림 이미지를 중심선 마스크로 그려가며 드러냄 */
function Doodles({ start }: { start: boolean }) {
  const [done, setDone] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!start || done) return;
    const end = Math.max(...DOODLES.flatMap((d) => d.strokes.map((s) => s.delay + s.dur)));
    const t = window.setTimeout(() => setDone(true), (end + 0.6) * 1000);
    return () => window.clearTimeout(t);
  }, [start, done]);
  return (
    <svg
      className={`hero__doodles${start ? ' is-writing' : ''}`}
      viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`}
      aria-hidden="true"
    >
      {!done && (
        <defs>
          {DOODLES.map((d) => (
            <mask key={d.name} id={`dd-${d.name}`} maskUnits="userSpaceOnUse" x={d.x} y={d.y} width={d.w} height={d.h}>
              {d.strokes.map((s, i) => (
                <path
                  key={i}
                  d={s.d}
                  className="hw-stroke"
                  style={{
                    strokeWidth: s.w,
                    strokeDasharray: `${s.len} ${s.len}`,
                    strokeDashoffset: s.len,
                    animationDuration: `${s.dur}s`,
                    animationDelay: `${s.delay + 0.25}s`,
                  }}
                />
              ))}
            </mask>
          ))}
        </defs>
      )}
      {DOODLES.map((d) => (
        <image
          key={d.name}
          href={asset(d.src)}
          x={d.x}
          y={d.y}
          width={d.w}
          height={d.h}
          mask={done ? undefined : `url(#dd-${d.name})`}
          className={`doodle doodle--${d.name}`}
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [ready, setReady] = useState(reduce);

  // 메인 사진이 준비되면 애니메이션 시작 (최대 1.2초 대기)
  useEffect(() => {
    if (reduce) return;
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      requestAnimationFrame(() => setReady(true));
    };
    const img = new Image();
    img.src = asset('/images/main/baby.webp');
    img.decode?.().then(go, go);
    img.onload = go;
    const t = window.setTimeout(go, 1200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const { event } = CONFIG;
  return (
    <section className={`hero${ready ? ' is-ready' : ''}`} aria-label="메인">
      <Snow />
      <div className="hero__inner">
        <div className="hero__stage" style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}` }}>
          {SHADOWS.map((sh) => (
            <span
              key={sh.name}
              className={`floor-shadow floor-shadow--${sh.name}`}
              aria-hidden="true"
              style={{ left: `${sh.x}%`, top: `${sh.y}%`, width: `${sh.w}%`, height: `${sh.h}%`, '--o': sh.o } as React.CSSProperties}
            />
          ))}
          {LAYER_ORDER.map((n, i) => {
            const b = LAYER_BOX[n];
            return (
              <div
                key={n}
                className={`layer layer--${n}`}
                style={
                  {
                    left: `${b.left}%`,
                    top: `${b.top}%`,
                    width: `${b.width}%`,
                    height: `${b.height}%`,
                    '--i': i,
                  } as React.CSSProperties
                }
              >
                <img
                  src={asset(`/images/main/${n}.webp`)}
                  alt={ALT[n]}
                  aria-hidden={ALT[n] ? undefined : true}
                  draggable={false}
                  decoding="async"
                  fetchPriority={n === 'baby' ? 'high' : 'auto'}
                />
              </div>
            );
          })}
          <Doodles start={ready} />
        </div>

        <h1 className="hero__title">
          <HandwrittenTitle start={ready} delay={0.35} />
        </h1>

        <div className="hero__info">
          <p className="hero__date">{event.dateText}</p>
          <p className="hero__place">{event.address} <span className="hero__venue">{event.venue}</span></p>
        </div>
      </div>
      <a className="hero__cue" href="#invitation" aria-label="아래로 스크롤">
        <span />
      </a>
    </section>
  );
}
