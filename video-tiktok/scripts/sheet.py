"""Contact sheet di una cartella di fotogrammi 1080x1920, con le safe zone TikTok disegnate.
Uso: python sheet.py <cartella_o_lista_file> <output.jpg> [colonne]"""
import sys, os, glob
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
files = sorted(glob.glob(os.path.join(src, "*.jpg"))) if os.path.isdir(src) else src.split(",")
files = [f for f in files if "contact" not in os.path.basename(f)]
W, H = 270, 480
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (W + 8), rows * (H + 34)), (30, 30, 30))
try:
    font = ImageFont.truetype("arial.ttf", 20)
except OSError:
    font = ImageFont.load_default()
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W, H))
    d = ImageDraw.Draw(im, "RGBA")
    s = W / 1080
    d.rectangle([0, 0, W, 150 * s], fill=(255, 0, 0, 40))
    d.rectangle([0, H - 380 * s, W, H], fill=(255, 0, 0, 40))
    d.rectangle([W - 140 * s, 0, W, H], fill=(255, 0, 0, 40))
    x, y = (i % cols) * (W + 8), (i // cols) * (H + 34)
    sheet.paste(im, (x, y + 30))
    ImageDraw.Draw(sheet).text((x + 4, y + 4), os.path.splitext(os.path.basename(f))[0] + " s", fill=(255, 220, 120), font=font)
sheet.save(out, quality=86)
print("contact sheet:", out, sheet.size)
