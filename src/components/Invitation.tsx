import { CONFIG } from '../config';
import SectionTitle from './SectionTitle';

export default function Invitation() {
  return (
    <section className="section section--invite" id="invitation" aria-labelledby="t-invite">
      <SectionTitle en="INVITATION" ko="초대합니다." id="t-invite" />
      <span className="ornament" aria-hidden="true" data-reveal>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
      <p className="invite__text" data-reveal>
        {CONFIG.texts.invitation}
      </p>
    </section>
  );
}
