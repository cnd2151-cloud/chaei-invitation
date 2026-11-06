import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lockBody, unlockBody } from '../lib/body';
import { ArrowIcon, CloseIcon } from './Icons';

/** 사진 확대 보기: 좌우 버튼 · 스와이프 · 키보드 · 순번 표시 */
export default function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: readonly string[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const open = index !== null;
  const n = photos.length;
  const [dx, setDx] = useState(0);
  const [anim, setAnim] = useState(false);
  const start = useRef<{ x: number; y: number; t: number; lock: 'x' | 'y' | null } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onChange((index + dir + n) % n);
  };

  useEffect(() => {
    if (!open) return;
    lockBody();
    box.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      unlockBody();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  // 이웃 사진 미리 로드
  useEffect(() => {
    if (index === null) return;
    [index - 1, index + 1].forEach((i) => {
      const im = new Image();
      im.src = photos[(i + n) % n];
    });
  }, [index, photos, n]);

  if (!open) return null;

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, t: performance.now(), lock: null };
    setAnim(false);
  };
  const onMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const mx = e.clientX - s.x, my = e.clientY - s.y;
    if (!s.lock && Math.hypot(mx, my) > 8) s.lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    if (s.lock === 'x') setDx(mx);
  };
  const onUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const mx = e.clientX - s.x;
    const v = Math.abs(mx) / Math.max(1, performance.now() - s.t);
    setAnim(true);
    if (s.lock === 'x' && (Math.abs(mx) > 60 || v > 0.5)) {
      setDx(0);
      go(mx < 0 ? 1 : -1);
    } else {
      setDx(0);
    }
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="사진 크게 보기"
      tabIndex={-1}
      ref={box}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lightbox__top">
        <span className="lightbox__count" aria-live="polite">
          {index! + 1} <i>/</i> {n}
        </span>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      </div>
      <div
        className="lightbox__stage"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <img
          key={index}
          src={photos[index!]}
          alt={`사진 ${index! + 1} / ${n}`}
          className={`lightbox__img${anim ? ' is-anim' : ''}`}
          style={{ transform: `translate3d(${dx}px,0,0)` }}
          draggable={false}
        />
      </div>
      <button type="button" className="lightbox__nav is-prev" onClick={() => go(-1)} aria-label="이전 사진">
        <ArrowIcon dir="left" />
      </button>
      <button type="button" className="lightbox__nav is-next" onClick={() => go(1)} aria-label="다음 사진">
        <ArrowIcon dir="right" />
      </button>
    </div>,
    document.body,
  );
}
