import { CONFIG } from '../config';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: { sendDefault: (o: unknown) => void };
    };
  }
}

const SDK = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
let loading: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve();
  if (!loading) {
    loading = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = SDK;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = () => res();
      s.onerror = () => {
        loading = null;
        rej(new Error('kakao sdk load failed'));
      };
      document.head.appendChild(s);
    });
  }
  return loading;
}

/** 미리 SDK 를 받아둔다 (공유 버튼 근처까지 스크롤했을 때) */
export const preloadKakao = () => {
  if (CONFIG.share.kakaoJsKey) loadSdk().catch(() => {});
};

export function siteUrl(): string {
  return (CONFIG.share.siteUrl || __SITE_URL__ || window.location.origin).replace(/\/+$/, '');
}

export const absUrl = (p: string) => (/^https?:\/\//.test(p) ? p : `${siteUrl()}${p.startsWith('/') ? '' : '/'}${p}`);

/** 카카오톡 공유. 성공 시 'kakao', 키가 없거나 실패 시 'unavailable' */
export async function shareKakao(): Promise<'kakao' | 'unavailable'> {
  const key = CONFIG.share.kakaoJsKey;
  if (!key) return 'unavailable';
  try {
    await loadSdk();
    const K = window.Kakao!;
    if (!K.isInitialized()) K.init(key);
    const url = siteUrl() + '/';
    const link = { mobileWebUrl: url, webUrl: url };
    K.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: CONFIG.share.title,
        description: CONFIG.share.description,
        imageUrl: absUrl(CONFIG.share.thumbnail),
        imageWidth: CONFIG.share.thumbnailWidth,
        imageHeight: CONFIG.share.thumbnailHeight,
        link,
      },
      buttons: [{ title: CONFIG.share.kakaoButtonTitle, link }],
    });
    return 'kakao';
  } catch (e) {
    console.error(e);
    return 'unavailable';
  }
}
