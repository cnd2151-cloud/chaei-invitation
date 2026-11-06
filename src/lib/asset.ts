/**
 * '/images/..' 같은 public 경로를 배포 기준 경로(BASE_URL)에 맞춰 변환.
 * 미리보기 빌드에서는 window.__ASSETS__ 에 이미지가 data URI 로 들어 있어 그것을 우선 사용
 * (별도 파일을 불러올 수 없는 앱 내 미리보기 화면 대응).
 */
declare global {
  interface Window { __ASSETS__?: Record<string, string> }
}
export const asset = (p: string) => {
  const inlined = typeof window !== 'undefined' ? window.__ASSETS__?.[p] : undefined;
  if (inlined) return inlined;
  return p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + p.slice(1) : p;
};
