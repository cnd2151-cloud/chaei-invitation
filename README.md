# 채이 첫돌 모바일 초대장

React + TypeScript + Vite 로 만든 모바일 돌잔치 웹 초대장입니다.
별도 인트로 없이 **메인 비주얼(SECTION 01)** 이 첫 화면으로 열리고,
`Chaei's 1st Birthday` 제목이 **손글씨 획 순서대로 써지는 SVG 애니메이션**으로 나타납니다.

---

## 1. 무엇을 어디서 고치나요? (개발 지식 없이 수정)

### 📝 문구 · 날짜 · 장소 · 연락처 · 계좌 · 공유 설정 → `src/config.ts` 한 파일

| 바꾸고 싶은 것 | `src/config.ts` 의 항목 |
|---|---|
| 아기 이름 (한글/영문) | `baby.name`, `baby.nameEn` |
| 행사 날짜/시간 (D-day·달력 계산) | `event.date` (`'2026-12-13'`), `event.time` |
| 화면에 보이는 날짜 문구 | `event.dateText`, `event.dateTextWithDay`, `event.timeText` |
| 행사장 / 주소 | `event.venue`, `event.address` |
| 지도·길찾기 검색어 | `event.mapQuery`, `event.mapEmbedQuery` (+ 선택: `lat`, `lng`) |
| 초대 문구 | `texts.invitation` |
| 마음 전하는 곳 안내 | `texts.accountNotice` |
| 감사 문구 | `texts.thanks`, `texts.thanksSign` |
| 부모님 이름 · 전화번호 | `parents.dad`, `parents.mom` |
| 성장 스토리 (사진·날짜·제목·설명) | `story` |
| 갤러리 사진 목록 / 처음 보이는 수 | `gallery.photos`, `gallery.initialCount` |
| 주차 / 대중교통 안내 | `directions.parking`, `directions.transit` |
| 계좌 (은행·예금주·번호) | `accounts` |
| 카카오 공유 제목·설명·썸네일·주소·키 | `share` |

- 따옴표 `' '` 안의 글자만 바꾸면 됩니다. 문구 안의 줄바꿈은 그대로 화면에 반영됩니다.
- 이름·전화번호·계좌번호를 비워두면(`''`) 화면에 **‘미정’**으로 표시되고, 버튼을 누르면 “아직 등록되지 않았어요” 안내가 뜹니다.

### 🖼 사진 → `public/images/` 폴더

| 폴더 | 용도 | 권장 비율 |
|---|---|---|
| `public/images/parents/baby.webp` | 부모님 소개 사진 | 4:5 세로 |
| `public/images/story/01~05.webp` | 성장 스토리 | 4:5 세로 |
| `public/images/gallery/01~15.webp` | 갤러리 | 3:4 세로 (정사각형 썸네일로 잘려 보임) |
| `public/images/final/final.webp` | 마지막 사진 | 4:5 세로 |
| `public/images/og/og-image.jpg` | 카카오톡/링크 미리보기 썸네일 | **1200×630** |
| `public/images/main/*` | 메인 비주얼 레이어 (아기·풍선·곰·컵케이크·손그림) | 자동 생성 |

> 지금 들어 있는 스토리/갤러리/부모님/마지막 사진은 **메인 사진으로 만든 샘플**입니다. 실제 사진으로 교체해 주세요.

- **가장 쉬운 방법:** 같은 파일 이름으로 덮어쓰기.
- 이름이 다르거나 jpg/png 를 쓰려면 `src/config.ts` 의 경로만 바꾸세요. (예: `'/images/gallery/16.jpg'`)
- 사진은 긴 변 1200~1600px, 장당 500KB 이하를 권장합니다. (휴대폰 원본은 너무 커요 — [squoosh.app](https://squoosh.app) 에서 WebP 로 줄이면 좋습니다)
- 사진 파일이 없거나 경로가 틀리면 ‘사진 준비 중’ 자리 표시가 대신 나옵니다.

---

## 2. 배포하기 (무료 · HTTPS 주소 생성)

### 방법 A. Vercel (추천)
1. 이 폴더를 GitHub 저장소에 올립니다. (GitHub 웹에서 *Add file → Upload files* 로 폴더 내용을 끌어다 놓아도 됩니다. `node_modules`, `dist` 폴더는 제외)
2. [vercel.com](https://vercel.com) → GitHub 로 로그인 → **Add New… → Project** → 저장소 선택 → **Deploy**
   (설정은 `vercel.json` 에 들어 있어 따로 바꿀 것 없음)
3. 1분 정도 뒤 `https://프로젝트이름.vercel.app` 주소가 생깁니다.
4. 그 주소를 `src/config.ts` 의 `share.siteUrl` 에 넣고 다시 올리면 끝. (비워둬도 Vercel 기본 주소를 자동 사용하지만, 명시를 권장합니다)

### 방법 B. Netlify
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** → GitHub 저장소 선택 → Deploy
   (`netlify.toml` 에 설정 포함)
2. 생성된 `https://xxxx.netlify.app` 주소를 `share.siteUrl` 에 넣고 다시 배포.

### 수정 후 재배포
GitHub 저장소의 파일(사진·`config.ts`)을 수정·커밋하면 Vercel/Netlify 가 **자동으로 다시 배포**합니다.

### 내 컴퓨터에서 미리 보기 (선택)
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 파일 생성
```

---

## 3. 카카오톡 공유 설정 (단계별)

공유 버튼은 카카오 JavaScript 키가 있으면 **카카오톡 공유창**을 띄우고,
키가 없으면 기기 기본 공유창 → 링크 복사 순으로 자동 대체됩니다.

1. [developers.kakao.com](https://developers.kakao.com) 로그인 → **내 애플리케이션 → 애플리케이션 추가하기** (앱 이름: 예 `채이 첫돌`)
2. **앱 설정 → 앱 키** 에서 **JavaScript 키** 복사 → `src/config.ts` 의 `share.kakaoJsKey` 에 붙여넣기
3. **앱 설정 → 플랫폼 → Web 플랫폼 등록** → 사이트 도메인에 배포 주소 입력
   예) `https://chaei-birthday.vercel.app`
   (메뉴 위치가 바뀐 경우: *앱 → 플랫폼 키 → JavaScript 키 → JavaScript SDK 도메인* 에 같은 주소 등록)
4. (권장) **카카오 로그인/동의항목은 설정할 필요 없습니다.** 공유만 사용합니다.
5. 수정 후 재배포 → 휴대폰에서 초대장 열고 **카카오톡으로 공유하기** 버튼 테스트

공유 메시지에 들어가는 내용 (`src/config.ts → share`)
- 제목 `title` / 설명 `description` / 썸네일 `thumbnail` / 링크 `siteUrl` / 버튼 문구 `kakaoButtonTitle`

---

## 4. 링크 미리보기 썸네일 (Open Graph)

카카오톡에 **주소만 붙여넣어도** 미리보기가 뜨도록, 빌드할 때 `index.html` 에 아래 메타 태그가
**정적으로** 들어갑니다. (카카오 크롤러는 자바스크립트를 실행하지 않기 때문)

`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:image:width`, `og:image:height`

값은 모두 `src/config.ts → share` 에서 가져옵니다. 배포 후 확인 방법:
브라우저에서 `view-source:https://내주소/` 를 열어 `og:image` 가 `https://...` 로 시작하는지 확인.

### 썸네일 교체
- `public/images/og/og-image.jpg` 를 **1200×630** 이미지로 교체 (주요 내용은 가운데에 배치)
- 기본 썸네일은 메인 비주얼로 만든 것이며, `python3 tools/gen_images.py og` 로 다시 만들 수 있습니다.

### ⚠ 썸네일/제목을 바꿨는데 카톡에 예전 미리보기가 나올 때 (캐시 갱신)
카카오는 한 번 수집한 미리보기를 **최대 수일간 캐시**합니다.
1. [developers.kakao.com/tool/debugger/sharing](https://developers.kakao.com/tool/debugger/sharing) (공유 디버거) 접속
2. 초대장 주소 입력 → **캐시 초기화** 클릭 → 새 미리보기 확인
3. 그래도 그대로라면 **썸네일 파일 이름을 바꾸세요** (예: `og-image-v2.jpg`) → `share.thumbnail` 경로도 수정 → 재배포.
   파일 주소가 바뀌면 캐시와 무관하게 새 이미지를 가져옵니다.
4. 이미 보낸 카톡 메시지의 미리보기는 바뀌지 않습니다. 새로 공유한 메시지부터 반영됩니다.

---

## 5. 구성 (9개 섹션)

| # | 섹션 | 주요 기능 |
|---|---|---|
| 01 | 메인 비주얼 | 레이어 분리(아기·풍선·곰인형·컵케이크·손그림) · **손글씨 필기 애니메이션** · 손그림 그려지기 · 눈 내림 · 풍선 흔들림 |
| 02 | 초대합니다 | 초대 문구 |
| 03 | 부모님 · 연락하기 | 팝업(전화 `tel:` · 문자 `sms:`) · 바깥 클릭/닫기/ESC 로 닫힘 |
| 04 | 1년간의 성장 이야기 | 세로 타임라인 화보 |
| 05 | 돌잔치 달력 | 자동 생성 달력 · 날짜 강조 · **D-day 자동 계산**(한국시간 기준, 당일 ‘오늘’, 지난 뒤엔 감사 문구) |
| 06 | 갤러리 | 3열 그리드 · 사진 더 보기/접기 · 확대 뷰어(좌우 버튼·스와이프·키보드·순번) |
| 07 | 오시는 길 | 주소 복사 · 지도(터치 시 로드) · 네이버지도/카카오맵/티맵 · 주차/대중교통 |
| 08 | 마음 전하는 곳 | 아빠/엄마 계좌 아코디언 · 계좌번호 복사 |
| 09 | 마지막 사진 · 공유 | 감사 문구 · 카카오톡 공유 · 링크 복사 |

기타: 스크롤 페이드인 · `prefers-reduced-motion` 대응(정적 표시) · 이미지 지연 로딩/누락 대체 · 클립보드 미지원 환경 대체 · 화면 밖에서는 눈 효과 정지 · iOS 스크롤 잠금 처리.

---

## 6. 손글씨 애니메이션은 어떻게 동작하나요? (개발자용)

- `src/generated/titlePaths.ts` 에는 두 가지 SVG 경로가 들어 있습니다.
  - **fill**: 브러시 서체(Comforter Brush, OFL)의 글자 윤곽 → 실제로 보이는 글씨
  - **strokes**: 글자의 **중심선(획)** 을 필기 순서대로 정렬한 경로 + 각 획의 시작 시각/길이
- 중심선 경로를 SVG `<mask>` 안에서 `stroke-dashoffset` 으로 그려 나가면, 그 획이 지나간 자리만 글씨가 드러납니다 → 펜이 실제로 쓰는 듯한 효과.
  (타이핑·글자별 페이드인이 아님) 전체 약 1.9초, `Chaei's` → `1st Birthday` 순서.
- 애니메이션이 끝나면 마스크를 제거해 글씨를 또렷하게 고정합니다.
- 손그림(하트·왕관·Let's Party!)도 같은 방식으로 원본 손그림 이미지를 획 순서대로 드러냅니다.

### 제목 문구를 바꾸려면
```bash
pip install fonttools uharfbuzz scikit-image opencv-python-headless numpy scipy pillow
python3 tools/gen_title.py "Chaei's" "1st Birthday"
```

### 메인 비주얼 요소를 바꾸려면
`tools/source/layers/` 의 `*-trim.png`(투명 배경)를 교체하고 `match.json` 의 위치값을 조정한 뒤
`python3 tools/gen_layers.py` → `python3 tools/gen_images.py` 실행.

---

## 7. 폴더 구조
```
src/config.ts                ← ★ 모든 내용 수정은 여기
public/images/               ← ★ 사진 교체는 여기
src/components/              섹션별 컴포넌트
src/generated/               자동 생성 데이터 (손글씨 경로, 레이어 위치) — 직접 수정 X
src/styles/global.css        디자인 (컬러 토큰은 맨 위 :root)
tools/                       이미지/손글씨 생성 스크립트 (Python)
vercel.json / netlify.toml   배포 설정
```

폰트: Comforter Brush · Cormorant Garamond · Gowun Batang (SIL OFL), Pretendard (OFL).
