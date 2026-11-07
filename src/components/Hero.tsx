import { asset } from '../lib/asset';
import { useEffect, useRef, useState } from 'react';
import { canStrokeReveal, runStrokeReveal } from '../lib/strokeReveal';
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

/** 손그림 장식(하트·왕관·Let's Party!): 원본 손그림을 획 순서대로 그려 나감 (캔버스 → 완료 후 SVG 고정) */
function Doodles({ start }: { start: boolean }) {
  const [phase, setPhase] = useState<'wait' | 'drawing' | 'done'>(() => (canStrokeReveal() ? 'wait' : 'done'));
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!start || phase !== 'wait') return;
    setPhase('drawing');
    let stop = () => {};
    let cancelled = false;
    // 손그림 이미지를 모두 불러온 뒤 시작
    const imgs = DOODLES.map((d) => {
      const im = new Image();
      im.src = asset(d.src);
      return im;
    });
    Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; }))))
      .then(() => {
        if (cancelled || !canvas.current) return;
        stop = runStrokeReveal(
          canvas.current,
          { x: CANVAS.x, y: CANVAS.y, w: CANVAS.w, h: CANVAS.h },
          DOODLES.map((d, k) => ({
            strokes: d.strokes,
            paint: (ctx: CanvasRenderingContext2D) => ctx.drawImage(imgs[k], d.x, d.y, d.w, d.h),
          })),
          { delay: 0.25, onDone: () => setPhase('done') },
        );
      })
      .catch(() => setPhase('done'));
    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);
  return (
    <>
      <svg
        className={`hero__doodles is-${phase}`}
        viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`}
        aria-hidden="true"
      >
        {DOODLES.map((d) => (
          <image key={d.name} href={asset(d.src)} x={d.x} y={d.y} width={d.w} height={d.h} className={`doodle doodle--${d.name}`} />
        ))}
      </svg>
      {phase !== 'done' && <canvas ref={canvas} className="hero__doodles hero__doodles-canvas" aria-hidden="true" />}
    </>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);

  // 메인 사진이 준비되면 애니메이션 시작 (최대 1.2초 대기)
  useEffect(() => {
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
  }, []);

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
