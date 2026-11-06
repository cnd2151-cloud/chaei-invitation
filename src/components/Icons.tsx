const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path {...P} d="M5 4h3l1.6 4-2 1.3a11 11 0 0 0 5.1 5.1l1.3-2 4 1.6v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const SmsIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path {...P} d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" /></svg>
);
export const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect {...P} x="8" y="8" width="11" height="11" rx="1.5" /><path {...P} d="M16 8V6.5A1.5 1.5 0 0 0 14.5 5h-8A1.5 1.5 0 0 0 5 6.5v8A1.5 1.5 0 0 0 6.5 16H8" /></svg>
);
export const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path {...P} d="M6 9l6 6 6-6" /></svg>
);
export const HeartIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M12 20.5s-7.5-4.6-7.5-10.3C4.5 7.3 6.6 5.3 9 5.3c1.5 0 2.4.8 3 1.8.6-1 1.5-1.8 3-1.8 2.4 0 4.5 2 4.5 4.9 0 5.7-7.5 10.3-7.5 10.3z" /></svg>
);
export const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 6l-.9 3.3c-.1.3.3.5.5.3l3.9-2.6c.4 0 .9.1 1.3.1 5 0 9-3.1 9-7S17 4 12 4z" /></svg>
);
export const LinkIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path {...P} d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path {...P} strokeWidth={1.6} d="M6 6l12 12M18 6L6 18" /></svg>
);
export const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path {...P} strokeWidth={1.4} d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} /></svg>
);
