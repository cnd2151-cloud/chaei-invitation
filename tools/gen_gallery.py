"""
갤러리 사진 → 웹용 2종 (자르기·크기 조정만, 보정/재생성 없음)
  - public/images/gallery/NN.webp        확대 보기용 (긴 변 1280px)
  - public/images/gallery/thumb/NN.webp  격자 썸네일 (정사각형 480px, 아기 위치 기준으로 자름)

  pip install pillow pillow-heif
  python3 tools/gen_gallery.py

입력  tools/source/gallery/01~NN.(jpg|png|heic)
FOCUS: 썸네일에서 중심으로 둘 지점 (가로, 세로 비율 0~1). 목록에 없으면 가운데.
"""
import glob, os
from PIL import Image, ImageOps
try:
    from pillow_heif import register_heif_opener; register_heif_opener()
except ImportError:
    pass

FOCUS = {'01': (.46, .45), '02': (.5, .42), '03': (.5, .5), '04': (.5, .48), '05': (.5, .45),
         '06': (.5, .4), '07': (.5, .42), '08': (.5, .45), '09': (.5, .48), '10': (.5, .45),
         '11': (.5, .5), '12': (.5, .5), '13': (.5, .36), '14': (.5, .4), '15': (.5, .4)}
FULL, THUMB = 1280, 480
os.makedirs('public/images/gallery/thumb', exist_ok=True)
for src in sorted(glob.glob('tools/source/gallery/*.*')):
    n = os.path.splitext(os.path.basename(src))[0]
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    full = im.copy(); full.thumbnail((FULL, FULL), Image.LANCZOS)
    full.save(f'public/images/gallery/{n}.webp', quality=80, method=6)
    W, H = im.size; s = min(W, H); fx, fy = FOCUS.get(n, (.5, .5))
    x = min(max(fx * W - s / 2, 0), W - s); y = min(max(fy * H - s / 2, 0), H - s)
    im.resize((THUMB, THUMB), Image.LANCZOS, box=(x, y, x + s, y + s)).save(f'public/images/gallery/thumb/{n}.webp', quality=78, method=6)
    print(n, im.size, '->', full.size)
