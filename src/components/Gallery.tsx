import { useLayoutEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import SectionTitle from './SectionTitle';
import SmartImage from './SmartImage';
import Lightbox from './Lightbox';

export default function Gallery() {
  const photos = CONFIG.gallery.photos as readonly string[];
  const init = Math.min(CONFIG.gallery.initialCount, photos.length);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const [maxH, setMaxH] = useState<string>('none');

  // 접힘 높이 = 처음 init 장이 차지하는 높이. 펼침/접힘을 max-height 로 부드럽게.
  const measure = () => {
    const g = grid.current;
    if (!g) return;
    if (expanded || init >= photos.length) return setMaxH(`${g.scrollHeight}px`);
    const last = g.children[init - 1] as HTMLElement | undefined;
    if (last) setMaxH(`${last.offsetTop + last.offsetHeight}px`);
  };
  useLayoutEffect(() => {
    measure();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(measure);
    if (grid.current) ro.observe(grid.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const toggle = () => {
    if (expanded) {
      // 접을 때 갤러리 상단이 화면 밖이면 살짝 되돌려 줌
      const top = wrap.current!.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top: top - 80, behavior: 'smooth' });
    }
    setExpanded((v) => !v);
  };

  return (
    <section className="section section--gallery" aria-labelledby="t-gallery">
      <SectionTitle en="GALLERY" ko="사랑 가득한 모든 순간" id="t-gallery" />
      <div className="gallery" ref={wrap} data-reveal>
        <div className="gallery__clip" style={{ maxHeight: maxH }}>
          <ul className="gallery__grid" ref={grid}>
            {photos.map((src, i) => (
              <li key={src + i} className={!expanded && i >= init ? 'is-hidden' : ''}>
                <button
                  type="button"
                  className="gallery__item"
                  onClick={() => setView(i)}
                  aria-label={`사진 ${i + 1} 크게 보기`}
                  tabIndex={!expanded && i >= init ? -1 : 0}
                >
                  <SmartImage src={src} alt="" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {!expanded && init < photos.length && <div className="gallery__fade" aria-hidden="true" />}
      </div>
      {init < photos.length && (
        <button type="button" className="btn btn--text" onClick={toggle} aria-expanded={expanded}>
          {expanded ? '사진 접기' : '사진 더 보기'}
          <span className={`btn__chev${expanded ? ' is-up' : ''}`} aria-hidden="true" />
        </button>
      )}
      <Lightbox photos={photos} index={view} onClose={() => setView(null)} onChange={setView} />
    </section>
  );
}
