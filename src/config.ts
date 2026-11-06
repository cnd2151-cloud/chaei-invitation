/* =====================================================================
 *  채이 첫돌 초대장 — 설정 파일
 *  ---------------------------------------------------------------
 *  문구 · 날짜 · 장소 · 연락처 · 계좌 · 사진 · 공유 설정을
 *  모두 이 파일 한 곳에서 수정합니다.  (따옴표 ' ' 안의 글자만 바꾸세요)
 *
 *  • 사진 교체: public/images/ 폴더의 파일을 같은 이름으로 덮어쓰거나,
 *    아래 경로를 새 파일 이름으로 바꾸세요.  ('/images/...' 형식)
 *  • 비어 있는 값('')은 화면에 '미정'으로 표시되고, 버튼은 안내 메시지를 띄웁니다.
 *  • 수정 후 GitHub에 올리면(또는 재배포하면) 자동으로 반영됩니다.
 * ===================================================================== */

export const CONFIG = {
  /* ───────── 기본 정보 ───────── */
  baby: {
    name: '채이',
    nameEn: 'Chaei',
  },

  event: {
    /** 행사 날짜/시간 (D-day·달력 계산용) — 'YYYY-MM-DD', 'HH:mm' (24시간) */
    date: '2026-12-13',
    time: '14:30',
    /** 화면에 보이는 날짜 문구 */
    dateText: '2026년 12월 13일 오후 2시 30분',
    dateTextWithDay: '2026년 12월 13일 일요일',
    timeText: '오후 2시 30분',
    venue: '송도 더비앙',
    address: '인천 연수동 송도과학로16번길 33-1',
    /** 지도 검색어 (지도/길찾기 버튼이 이 검색어로 장소를 찾습니다) */
    mapQuery: '송도 더비앙',
    /** 지도 미리보기 검색어 (주소로 찾는 편이 정확합니다) */
    mapEmbedQuery: '인천 송도과학로16번길 33-1',
    /** 선택: 좌표를 넣으면 티맵/카카오 길찾기가 목적지로 바로 연결됩니다. 모르면 비워두세요. */
    lat: '',
    lng: '',
  },

  /* ───────── 문구 ───────── */
  texts: {
    /** SECTION 02 · 초대 문구 (줄바꿈 그대로 표시됩니다) */
    invitation: `작고 여린 손으로 세상을 처음 만난 날부터
매일 조금씩 자라 온 채이가
어느덧 첫 번째 생일을 맞이하게 되었습니다.

그동안 따뜻한 마음으로 지켜봐 주신
소중한 분들을 모시고
작은 감사의 자리를 마련하였습니다.

오셔서 채이의 첫걸음을
함께 축복해 주시면 감사하겠습니다.`,

    /** SECTION 08 · 마음 전하는 곳 안내 문구 */
    accountNotice: `직접 축하를 전하지 못하는 분들을 위해
부득이하게 계좌번호를 기재하게 되었습니다.
넓은 마음으로 양해 부탁드립니다.`,

    /** SECTION 09 · 마지막 감사 문구 */
    thanks: `채이의 첫 생일을 함께 축하해 주셔서
진심으로 감사드립니다.
받은 사랑 잊지 않고, 예쁘고 건강하게 키우겠습니다.`,
    thanksSign: '채이 아빠 · 엄마 드림',
  },

  /* ───────── 부모님 & 연락처 ─────────
   *  phone: 숫자만 또는 010-0000-0000 형식. 비워두면 '연락처 준비 중' 안내가 뜹니다. */
  parents: {
    photo: '/images/parents/baby.webp',
    dad: { label: '아빠', name: '', phone: '' },
    mom: { label: '엄마', name: '', phone: '' },
  },

  /* ───────── 1년간의 성장 이야기 ───────── */
  story: [
    {
      photo: '/images/story/01.webp',
      date: '2025. 00. 00',
      title: '봄별이와의 첫 인사',
      desc: '봄처럼 따스하게, 별처럼 반짝이며\n우리에게 찾아온 작은 기적.',
    },
    {
      photo: '/images/story/02.webp',
      date: '2025. 00. 00',
      title: '우리가족과의 첫 만남',
      desc: '처음 품에 안은 그날,\n세상의 모든 것이 새로워졌어요.',
    },
    {
      photo: '/images/story/03.webp',
      date: '2026. 00. 00',
      title: '첫번째 축하 100일',
      desc: '눈을 맞추고 방긋 웃어 주던\n백 일의 기적 같은 날들.',
    },
    {
      photo: '/images/story/04.webp',
      date: '2026. 00. 00',
      title: '200일의 축복',
      desc: '옹알이로 대답하고, 손을 뻗어 세상을 만지며\n하루하루 자라는 채이.',
    },
    {
      photo: '/images/story/05.webp',
      date: '2026. 12. 13',
      title: '1ST BIRTHDAY',
      desc: '건강하게 자라 준 고마운 1년,\n이제 첫 번째 생일을 맞이합니다.',
    },
  ],

  /* ───────── 갤러리 ─────────
   *  사진 추가/삭제는 이 목록에 줄을 더하거나 지우면 됩니다. */
  gallery: {
    initialCount: 9, // 처음에 보여줄 사진 수 (3의 배수 추천)
    photos: [
      '/images/gallery/01.webp',
      '/images/gallery/02.webp',
      '/images/gallery/03.webp',
      '/images/gallery/04.webp',
      '/images/gallery/05.webp',
      '/images/gallery/06.webp',
      '/images/gallery/07.webp',
      '/images/gallery/08.webp',
      '/images/gallery/09.webp',
      '/images/gallery/10.webp',
      '/images/gallery/11.webp',
      '/images/gallery/12.webp',
      '/images/gallery/13.webp',
      '/images/gallery/14.webp',
      '/images/gallery/15.webp',
    ],
  },

  /* ───────── 오시는 길 안내 ───────── */
  directions: {
    parking: '주차 안내는 추후 업데이트 예정입니다.',
    transit: '대중교통 안내는 추후 업데이트 예정입니다.',
  },

  /* ───────── 마음 전하는 곳 (계좌) ─────────
   *  number 를 비워두면 '미정'으로 표시되고 복사 버튼이 안내 메시지를 띄웁니다. */
  accounts: [
    { group: '아빠 계좌', holder: '', bank: '', number: '' },
    { group: '엄마 계좌', holder: '', bank: '', number: '' },
  ],

  /* ───────── 마지막 사진 ───────── */
  finalPhoto: '/images/final/final.webp',

  /* ───────── 공유 (카카오톡 · 링크 미리보기) ─────────
   *  ※ title / description / thumbnail 은 빌드할 때 HTML 의 og 메타태그에도 들어갑니다.
   *  ※ siteUrl 에는 배포된 주소를 넣으세요. (예: 'https://chaei-birthday.vercel.app')
   *     비워두면 Vercel/Netlify 의 기본 주소를 자동으로 사용합니다. */
  share: {
    siteUrl: '',
    title: "채이의 첫 번째 생일에 초대합니다",
    description: '2026년 12월 13일 (일) 오후 2시 30분 · 송도 더비앙',
    /** 1200×630 권장. 교체 시 파일 이름을 바꾸면 카카오 캐시 문제도 피할 수 있어요. */
    thumbnail: '/images/og/og-image.jpg',
    thumbnailWidth: 1200,
    thumbnailHeight: 630,
    /** 카카오 디벨로퍼스 → 내 애플리케이션 → 앱 키 → 'JavaScript 키' */
    kakaoJsKey: '',
    kakaoButtonTitle: '초대장 보기',
  },
} as const;

export type Config = typeof CONFIG;
