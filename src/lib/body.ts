/** 모달이 열려 있는 동안 배경 스크롤 잠금 (iOS 포함) */
let count = 0;
let saved = 0;
export function lockBody() {
  if (count++ === 0) {
    saved = window.scrollY;
    const b = document.body.style;
    b.position = 'fixed';
    b.top = `-${saved}px`;
    b.left = '0';
    b.right = '0';
    b.overflow = 'hidden';
  }
}
export function unlockBody() {
  if (count > 0 && --count === 0) {
    const b = document.body.style;
    b.position = b.top = b.left = b.right = b.overflow = '';
    window.scrollTo(0, saved);
  }
}
