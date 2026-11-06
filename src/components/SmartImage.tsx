import { asset } from '../lib/asset';
import { useState, type ImgHTMLAttributes } from 'react';

/** 지연 로딩 + 누락 이미지 대체 화면 */
export default function SmartImage({
  className = '',
  eager,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { eager?: boolean }) {
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading');
  if (state === 'err') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={rest.alt || '사진'}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM4 15l4.5-4.5 4 4 2.5-2.5L20 17M15.5 9.5h.01"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>사진 준비 중</span>
      </div>
    );
  }
  return (
    <img
      {...rest}
      src={rest.src ? asset(rest.src) : rest.src}
      className={`${className} smart-img${state === 'ok' ? ' is-loaded' : ''}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setState('ok')}
      onError={() => setState('err')}
    />
  );
}
