"""Controllo del video finale: ffprobe, fotogrammi neri/bianchi, salti di luminanza, contact sheet 1 fps con safe zone.
Uso: python scripts/check.py"""
import json, os, subprocess, sys, tempfile, glob
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO = os.path.join(HERE, "osteria-del-borgo-tiktok.mp4")
CHECK = os.path.join(HERE, "check")
os.makedirs(CHECK, exist_ok=True)

info = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", VIDEO]))
v = next(s for s in info["streams"] if s["codec_type"] == "video")
a = [s for s in info["streams"] if s["codec_type"] == "audio"]
print(f"video: {v['codec_name']} {v.get('profile')} {v['width']}x{v['height']} {v['pix_fmt']} r={v['r_frame_rate']} avg={v['avg_frame_rate']} frames={v.get('nb_frames')}")
print(f"audio: {[(s['codec_name'], s.get('channels')) for s in a]}")
print(f"durata: {float(info['format']['duration']):.2f} s, dimensione: {int(info['format']['size']) / 1024 / 1024:.1f} MB")

# luminanza media di ogni fotogramma (in piccolo)
tmp = tempfile.mkdtemp()
subprocess.check_call(["ffmpeg", "-v", "error", "-i", VIDEO, "-vf", "scale=54:96,format=gray", "-f", "rawvideo", os.path.join(tmp, "y.raw")])
raw = np.fromfile(os.path.join(tmp, "y.raw"), dtype=np.uint8).reshape(-1, 96, 54).astype(np.float32)
lum = raw.mean(axis=(1, 2))
black = np.where(lum < 6)[0]
white = np.where(lum > 245)[0]
jumps = np.abs(np.diff(lum))
print(f"fotogrammi: {len(lum)}; neri: {len(black)} {black[:10].tolist()}; bianchi: {len(white)}")
big = np.where(jumps > 0.2 * 255)[0]
print(f"salti di luminanza > 20%: {len(big)} ai fotogrammi {big.tolist()[:20]}")
# fotogrammi identici consecutivi lunghi (possibile blocco)
diff = np.abs(np.diff(raw, axis=0)).mean(axis=(1, 2))
still_runs, run = [], 0
for i, d in enumerate(diff):
    run = run + 1 if d < 0.05 else 0
    if run == 45:
        still_runs.append(i / 60)
print(f"fermi oltre 0,75 s (secondi): {[round(x, 2) for x in still_runs]}")

# contact sheet 1 fps
for f in glob.glob(os.path.join(CHECK, "f_*.jpg")):
    os.remove(f)
subprocess.check_call(["ffmpeg", "-v", "error", "-i", VIDEO, "-vf", "fps=1", "-q:v", "3", os.path.join(CHECK, "f_%03d.jpg")])
subprocess.check_call([sys.executable, os.path.join(HERE, "scripts", "sheet.py"), CHECK, os.path.join(CHECK, "contact-sheet.jpg"), "7"])
