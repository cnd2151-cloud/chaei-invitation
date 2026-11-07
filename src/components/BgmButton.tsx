import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { asset } from '../lib/asset';
import { useToast } from '../lib/toast';

const KEY = 'chaei-bgm-off';
const readOff = () => {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
};
const writeOff = (v: boolean) => {
  try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch { /* 저장 불가 환경 */ }
};

/**
 * 배경음악 ON/OFF 버튼 (화면 오른쪽 위 고정)
 * - 브라우저 자동재생 제한: 소리는 '사용자 동작' 안에서만 재생 가능 →
 *   열자마자 한 번 시도하고, 막히면 첫 터치/클릭/키 입력 순간 재생 (iOS 사파리·카카오톡 인앱·안드로이드·PC)
 * - 사용자가 끈 경우 기억해 두었다가 다시 켜지 않음
 * - 다른 앱/탭으로 나가면 일시정지, 돌아오면 이어서 재생
 */
export default function BgmButton() {
  const { src, volume, autoplay } = CONFIG.bgm;
  const audio = useRef<HTMLAudioElement | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const wantRef = useRef(autoplay && !readOff()); // 사용자가 원하는 상태
  const toast = useToast();

  const getAudio = () => {
    if (!src) return null;
    if (!audio.current) {
      const a = new Audio();
      a.src = asset(src);
      a.loop = true;
      a.preload = 'auto';
      a.volume = volume; // iOS 는 볼륨 조절을 무시(기기 볼륨 사용)
      a.setAttribute('playsinline', '');
      a.addEventListener('play', () => setPlaying(true));
      a.addEventListener('pause', () => setPlaying(false));
      a.addEventListener('error', () => setPlaying(false));
      audio.current = a;
    }
    return audio.current;
  };

  const tryPlay = () => {
    const a = getAudio();
    if (!a) return Promise.resolve(false);
    const p = a.play();
    return (p && typeof p.then === 'function' ? p : Promise.resolve()).then(() => true, () => false);
  };

  // 자동재생 시도 → 막히면 첫 사용자 동작 때 재생
  useEffect(() => {
    if (!src) return;
    let armed = false;
    const events = ['touchend', 'click', 'keydown'] as const;
    const onFirst = (e: Event) => {
      if (btn.current && e.target instanceof Node && btn.current.contains(e.target)) return; // 버튼은 자체 처리
      disarm();
      if (wantRef.current && audio.current?.paused !== false) tryPlay();
    };
    const arm = () => { if (!armed) { armed = true; events.forEach((ev) => document.addEventListener(ev, onFirst, true)); } };
    const disarm = () => { if (armed) { armed = false; events.forEach((ev) => document.removeEventListener(ev, onFirst, true)); } };

    if (wantRef.current) {
      tryPlay().then((ok) => { if (!ok) arm(); });
    }
    const onVis = () => {
      const a = audio.current;
      if (!a) return;
      if (document.hidden) { if (!a.paused) a.pause(); }
      else if (wantRef.current && a.paused) tryPlay().then((ok) => { if (!ok) arm(); });
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      disarm();
      document.removeEventListener('visibilitychange', onVis);
      audio.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = () => {
    if (!src) {
      toast('배경음악은 준비 중이에요.');
      return;
    }
    const a = getAudio()!;
    if (a.paused) {
      wantRef.current = true;
      writeOff(false);
      tryPlay().then((ok) => { if (!ok) toast('음악을 재생할 수 없어요. 잠시 후 다시 눌러 주세요.'); });
    } else {
      wantRef.current = false;
      writeOff(true);
      a.pause();
    }
  };

  return (
    <div className="bgm-dock">
      <button
        ref={btn}
        type="button"
        className={`bgm-btn${playing ? ' is-on' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? '배경음악 끄기' : '배경음악 켜기'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M4.5 9.5h3l4-3.5v12l-4-3.5h-3z" fill="currentColor" />
          {playing ? (
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path className="bgm-wave w1" d="M14.5 9.5a3.5 3.5 0 0 1 0 5" />
              <path className="bgm-wave w2" d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6" />
            </g>
          ) : (
            <path d="M15 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  );
}
