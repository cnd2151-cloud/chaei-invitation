"""
Generate SAMPLE photos (story / gallery / parents / final) and the
Kakao/OG share thumbnail (1200x630) from the main visual.

  python3 tools/gen_images.py            # everything
  python3 tools/gen_images.py og         # only the share thumbnail

The sample photos are placeholders built from the main photo so the page
looks complete. Replace the files in public/images/** with real photos
(same file names) — or change the paths in src/config.ts.
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
comp = Image.open(P('tools/source/_composite.png')).convert('RGBA')   # 1070x1065 canvas
F = lambda n, s: ImageFont.truetype(P('tools/fonts', n), s)

CREAM, WARM, IVORY, GREY, ROSE = (246, 241, 235), (239, 230, 220), (251, 248, 244), (236, 234, 231), (244, 236, 236)


def shot(cx, cy, cw, aspect, bg, out, size, tone=None, layers=None):
    ch = cw/aspect
    box = (int(cx-cw/2), int(cy-ch/2), int(cx+cw/2), int(cy+ch/2))
    canvas = Image.new('RGBA', comp.size, bg + (255,))
    src = comp
    if layers:   # only some objects
        src = Image.new('RGBA', comp.size, (0, 0, 0, 0))
        for n in layers:
            src.alpha_composite(n)
    # soft floor shadow
    sh = Image.new('RGBA', comp.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(sh); d.ellipse((150, 990, 930, 1065), fill=(60, 40, 30, 38))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(22)))
    canvas.alpha_composite(src)
    pad = Image.new('RGBA', (comp.width+2000, comp.height+2000), bg + (255,))
    pad.paste(canvas, (1000, 1000))
    im = pad.crop((box[0]+1000, box[1]+1000, box[2]+1000, box[3]+1000)).convert('RGB')
    im = im.resize(size, Image.LANCZOS)
    if tone == 'bw':
        im = ImageOps.grayscale(im).convert('RGB'); im = ImageEnhance.Contrast(im).enhance(1.05)
    elif tone == 'warm':
        r, g, b = im.split(); r = r.point(lambda v: min(255, v*1.03)); b = b.point(lambda v: v*0.95); im = Image.merge('RGB', (r, g, b))
    elif tone == 'soft':
        im = Image.blend(im, Image.new('RGB', im.size, (255, 255, 255)), 0.08)
    os.makedirs(os.path.dirname(P(out)), exist_ok=True)
    im.save(P(out), quality=84, method=6)


def og():
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), (253, 251, 249))
    c = comp.copy(); s = 600/c.height
    c = c.resize((int(c.width*s), int(c.height*s)), Image.LANCZOS)
    im.paste(c, (40, 22), c)
    d = ImageDraw.Draw(im)
    burg = (85, 9, 13)
    d.text((878, 118), 'THE FIRST BIRTHDAY', font=F('CormorantGaramond.ttf', 24), fill=burg, anchor='mm')
    d.text((878, 225), "Chaei's", font=F('ComforterBrush-Regular.ttf', 150), fill=(30, 30, 30), anchor='mm')
    d.text((878, 345), '1st Birthday', font=F('ComforterBrush-Regular.ttf', 132), fill=(30, 30, 30), anchor='mm')
    d.line((838, 432, 918, 432), fill=burg, width=2)
    d.text((878, 478), '2026. 12. 13 SUN  PM 2:30', font=F('CormorantGaramond.ttf', 30), fill=(51, 51, 51), anchor='mm')
    d.text((878, 524), '송도 더비앙', font=(F('GowunBatang-Regular.ttf', 26) if os.path.exists(P('tools/fonts/GowunBatang-Regular.ttf')) else ImageFont.load_default(26)), fill=(110, 110, 110), anchor='mm')
    im.save(P('public/images/og/og-image.jpg'), quality=88, optimize=True, progressive=True)


if __name__ == '__main__':
    og()
    if len(sys.argv) > 1 and sys.argv[1] == 'og':
        sys.exit()
    # parents (portrait)
    shot(470, 470, 520, 4/5, CREAM, 'public/images/parents/baby.webp', (800, 1000), 'soft')
    # story 01..05
    shot(475, 455, 300, 4/5, GREY, 'public/images/story/01.webp', (800, 1000), 'bw')
    shot(470, 520, 420, 4/5, IVORY, 'public/images/story/02.webp', (800, 1000), 'soft')
    shot(480, 590, 640, 4/5, WARM, 'public/images/story/03.webp', (800, 1000), 'warm')
    shot(380, 640, 760, 4/5, ROSE, 'public/images/story/04.webp', (800, 1000))
    shot(520, 560, 1000, 4/5, CREAM, 'public/images/story/05.webp', (800, 1000), 'warm')
    # gallery 01..15 (3:4 portrait + some square)
    g = [
        (480, 470, 360, 3/4, CREAM, None), (520, 560, 980, 3/4, IVORY, 'soft'), (470, 450, 260, 3/4, GREY, 'bw'),
        (300, 720, 480, 3/4, WARM, 'warm'), (700, 760, 460, 3/4, ROSE, None), (480, 600, 700, 3/4, CREAM, 'bw'),
        (470, 300, 560, 3/4, IVORY, None), (480, 480, 460, 3/4, WARM, 'warm'), (520, 560, 1060, 3/4, GREY, 'soft'),
        (480, 820, 520, 3/4, CREAM, None), (470, 470, 300, 3/4, ROSE, 'soft'), (430, 600, 820, 3/4, IVORY, 'bw'),
        (560, 520, 620, 3/4, WARM, None), (480, 430, 420, 3/4, CREAM, 'bw'), (520, 560, 900, 3/4, ROSE, 'warm'),
    ]
    for i, (cx, cy, cw, asp, bg, tone) in enumerate(g, 1):
        shot(cx, cy, cw, asp, bg, f'public/images/gallery/{i:02d}.webp', (900, 1200), tone)
    # final
    shot(500, 540, 1000, 4/5, IVORY, 'public/images/final/final.webp', (1000, 1250), 'soft')
    print('done')
