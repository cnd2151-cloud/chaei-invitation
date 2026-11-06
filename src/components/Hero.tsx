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
 * 바닥 그림자 — 빛은 왼쪽 위에서 들어옴 (아기·컵케이크·풍선의 명암 기준)
 *  - core : 바닥에 닿는 지점의 짙은 접지 그림자 (각 오브젝트 밑면 기울기 r 에 맞춤)
 *  - cast : 빛 반대(오른쪽 뒤)로 길게 퍼지는 옅은 그림자. 오브젝트 쪽이 진하고 끝으로 갈수록 흐려짐
 *  x,y = 중심(메인 비주얼 기준 %), w,h = 크기(%), r = 회전(도), o = 진하기(0~1)
 */
const SHADOWS = [
  // 곰인형 (뒤쪽에 앉아 있어 바닥선이 더 높음)
  { kind: 'cast', x: 26.5, y: 89.0, w: 32, h: 5.4, r: -4, o: 0.85 },
  { kind: 'core', x: 21.2, y: 89.9, w: 22, h: 2.2, r: -4.2, o: 0.9 },
  // 아기 (양발 + 엉덩이 세 지점 접지)
  { kind: 'cast', x: 52.5, y: 96.6, w: 56, h: 6.6, r: -2.5, o: 0.95 },
  { kind: 'core', x: 44.0, y: 94.6, w: 13, h: 2.0, r: -1.9, o: 0.65 },
  { kind: 'core', x: 32.6, y: 98.1, w: 17, h: 2.3, r: -1.9, o: 1 },
  { kind: 'core', x: 57.4, y: 97.9, w: 15, h: 2.2, r: -1.9, o: 1 },
  // 컵케이크 (기울어져 오른쪽 아래 모서리로 바닥을 짚음)
  { kind: 'cast', x: 77.0, y: 95.6, w: 20, h: 4.0, r: -3, o: 0.85 },
  { kind: 'core', x: 74.4, y: 95.8, w: 8.5, h: 1.6, r: 11.6, o: 1 },
] as const;

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
          {SHADOWS.map((sh, i) => (
            <span
              key={i}
              className={`floor-shadow is-${sh.kind}`}
              aria-hidden="true"
              style={
                {
                  left: `${sh.x}%`,
                  top: `${sh.y}%`,
                  width: `${sh.w}%`,
                  height: `${sh.h}%`,
                  '--r': `${sh.r}deg`,
                  '--o': sh.o,
                } as React.CSSProperties
              }
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
