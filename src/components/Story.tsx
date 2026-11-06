import { CONFIG } from '../config';
import SectionTitle from './SectionTitle';
import SmartImage from './SmartImage';

export default function Story() {
  return (
    <section className="section section--story" aria-labelledby="t-story">
      <SectionTitle en="A YEAR OF STORY" ko="1년간의 성장 이야기" id="t-story" />
      <ol className="story">
        {CONFIG.story.map((s, i) => (
          <li key={i} className={`story__item${i % 2 ? ' is-alt' : ''}${i === CONFIG.story.length - 1 ? ' is-last' : ''}`}>
            <span className="story__dot" aria-hidden="true" />
            <div className="story__media" data-reveal>
              <SmartImage src={s.photo} alt={s.title} />
              <span className="story__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="story__text" data-reveal>
              <p className="story__date">{s.date}</p>
              <h3 className="story__title">{s.title}</h3>
              <p className="story__desc">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
