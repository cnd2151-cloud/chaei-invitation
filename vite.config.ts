import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { CONFIG } from './src/config';

/** 배포 주소 결정: config.share.siteUrl → SITE_URL 환경변수 → Vercel → Netlify */
function resolveSiteUrl(): string {
  const env = process.env;
  const raw =
    CONFIG.share.siteUrl ||
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : '') ||
    env.URL || // Netlify
    '';
  return raw.replace(/\/+$/, '');
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** index.html 의 %...% 자리에 og 메타 값을 "정적으로" 써 넣는다 (카카오 크롤러는 JS 를 실행하지 않음) */
function ogMetaPlugin(): Plugin {
  return {
    name: 'og-meta',
    transformIndexHtml(html) {
      const site = resolveSiteUrl();
      const s = CONFIG.share;
      const img = /^https?:\/\//.test(s.thumbnail) ? s.thumbnail : `${site}${s.thumbnail}`;
      if (!site) {
        console.warn(
          '\n[og-meta] ⚠ 배포 주소(siteUrl)를 알 수 없어 og:image 가 상대경로입니다. ' +
            'src/config.ts 의 share.siteUrl 에 배포 주소를 넣어주세요.\n',
        );
      }
      const map: Record<string, string> = {
        '%SHARE_TITLE%': s.title,
        '%SHARE_DESC%': s.description,
        '%SHARE_IMAGE%': img,
        '%SHARE_IMAGE_W%': String(s.thumbnailWidth),
        '%SHARE_IMAGE_H%': String(s.thumbnailHeight),
        '%SHARE_URL%': site ? `${site}/` : '/',
      };
      return html.replace(/%SHARE_[A-Z_]+%/g, (k) => esc(map[k] ?? k));
    },
  };
}

export default defineConfig({
  plugins: [react(), ogMetaPlugin()],
  define: {
    __SITE_URL__: JSON.stringify(resolveSiteUrl()),
    __PREVIEW__: JSON.stringify(process.env.PREVIEW === '1'),
  },
  build: { target: 'es2019', assetsInlineLimit: 0 },
});
