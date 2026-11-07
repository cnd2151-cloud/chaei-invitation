import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import { asset } from '../lib/asset';

/**
 * 사진 + 누락 이미지 대체 화면
 * - 모바일 앱 내장 브라우저(iOS WebView 등)에서 지연 로딩이 동작하지 않는 경우가 있어
 *   기본은 즉시 로딩(eager). 로딩 완료/이미 캐시됨/일정 시간 경과 중 하나면 반드시 표시.
 */
export default function SmartImage({
  className = '',
  lazy,
  fallbackSrc,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { lazy?: boolean; fallbackSrc?: string }) {
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading');
  const [src, setSrc] = useState(rest.src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setState('ok');
    // 안전장치: 로드 이벤트를 못 받아도 2.5초 뒤에는 보이게
    const t = window.setTimeout(() => setState((s) => (s === 'loading' ? 'ok' : s)), 2500);
    return () => window.clearTimeout(t);
  }, []);

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
      ref={ref}
      src={src ? asset(src) : src}
      className={`${className} smart-img${state === 'ok' ? ' is-loaded' : ''}`}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      onLoad={() => setState('ok')}
      onError={() => {
        // 썸네일이 없으면 원본 사진으로 한 번 더 시도
        if (fallbackSrc && src !== fallbackSrc) setSrc(fallbackSrc);
        else setState('err');
      }}
    />
  );
}
