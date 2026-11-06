/** '/images/..' 같은 public 경로를 배포 기준 경로(BASE_URL)에 맞춰 변환 */
export const asset = (p: string) =>
  p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + p.slice(1) : p;
