"""
성장 이야기 사진 → 4:5 웹용 이미지 (자르기·크기 조정만, 보정/재생성 없음)

  pip install pillow pillow-heif
  python3 tools/gen_story.py

입력  tools/source/story/01~05.(jpg|heic)   출력  public/images/story/01~05.webp
FOCUS: 사진에서 중심으로 두고 싶은 지점 (가로·세로 비율 0~1)
"""
import glob
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener
register_heif_opener()

FOCUS = {'01': (0.5, 0.5), '02': (0.5, 0.42), '03': (0.5, 0.52), '04': (0.5, 0.55), '05': (0.5, 0.56)}
OUT = (1200, 1500)
for n, (fx, fy) in FOCUS.items():
    src = glob.glob(f'tools/source/story/{n}.*')[0]
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    cw, ch = (W, W * 5 / 4) if W * 5 / 4 <= H else (H * 4 / 5, H)
    x = min(max(fx * W - cw / 2, 0), W - cw); y = min(max(fy * H - ch / 2, 0), H - ch)
    im.resize(OUT, Image.LANCZOS, box=(x, y, x + cw, y + ch)).save(f'public/images/story/{n}.webp', quality=85, method=6)
    print(n, im.size, 'crop', [round(v) for v in (x, y, x + cw, y + ch)])
