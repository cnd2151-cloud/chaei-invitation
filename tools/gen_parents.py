"""
부모님 어릴 적 사진 2분할 콜라주 (AI 재생성 없음: 자르기·크기 맞춤·선명도 보정만)

  python3 tools/gen_parents.py

입력  tools/source/parents/{dad,mom}-original.webp
출력  인쇄용  print/parents-collage.jpg, print/dad.jpg, print/mom.jpg
      웹용    public/images/parents/collage.webp
"""
import os
from PIL import Image, ImageFilter

SRC = 'tools/source/parents'
# 눈 위치(원본 px) — 두 아기의 얼굴 크기/높이를 맞추는 기준점
EYES = {'dad': ((465, 438), (590, 423)), 'mom': ((552, 512), (675, 503))}
CROP_W, CROP_H = 1046, 1307          # 4:5, 기준(아빠 사진) px
EYE_X, EYE_Y = 527, 420              # 크롭 안에서 두 눈 중심이 올 위치
OUT_W, OUT_H = 2400, 3000            # 인쇄용 개별 사진 (4:5)
GAP, FRAME = 110, 150                # 사진 사이 / 바깥 흰 여백 (인쇄용 px)

def eye_mid(e): return ((e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2)
def eye_dist(e): return ((e[0][0] - e[1][0]) ** 2 + (e[0][1] - e[1][1]) ** 2) ** 0.5

ref = eye_dist(EYES['dad'])
os.makedirs('print', exist_ok=True); os.makedirs('public/images/parents', exist_ok=True)
shots = {}
for n in ('dad', 'mom'):
    im = Image.open(f'{SRC}/{n}-original.webp').convert('RGB')
    s = ref / eye_dist(EYES[n])                       # 얼굴 크기 통일
    mx, my = eye_mid(EYES[n])
    left, top = mx * s - EYE_X, my * s - EYE_Y         # 눈 높이·중심 통일
    box = (left / s, top / s, (left + CROP_W) / s, (top + CROP_H) / s)
    assert box[0] >= 0 and box[1] >= 0 and box[2] <= im.width and box[3] <= im.height, (n, box)
    out = im.resize((OUT_W, OUT_H), Image.LANCZOS, box=box)
    # 화질 보정: 업스케일 후 은은한 선명도만 (색·형태 변경 없음)
    out = out.filter(ImageFilter.UnsharpMask(radius=2.2, percent=55, threshold=3))
    out.save(f'print/{n}.jpg', quality=95, subsampling=0, dpi=(300, 300))
    shots[n] = out
    print(n, 'scale %.3f' % s, 'crop', [round(v) for v in box])

W = FRAME * 2 + OUT_W * 2 + GAP
H = FRAME * 2 + OUT_H
col = Image.new('RGB', (W, H), (255, 255, 255))
col.paste(shots['dad'], (FRAME, FRAME))
col.paste(shots['mom'], (FRAME + OUT_W + GAP, FRAME))
col.save('print/parents-collage.jpg', quality=95, subsampling=0, dpi=(300, 300))
col.resize((1400, round(1400 * H / W)), Image.LANCZOS).save('public/images/parents/collage.webp', quality=88, method=6)
print('collage', W, H)
