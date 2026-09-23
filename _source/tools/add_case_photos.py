#!/usr/bin/env python3
"""Prepare case or news photos: resize to 2000px on the long side, convert to WebP q82, strip EXIF (GPS!), name 01.webp, 02.webp ...
Usage: python3 _source/tools/add_case_photos.py <slug> <photo1> <photo2> ...   (writes to assets/cases/<slug>/)
       python3 _source/tools/add_case_photos.py --news <slug> <photo>             (writes to assets/news/<slug>.webp)
"""
import sys, os
from PIL import Image, ImageOps
root = os.path.join(os.path.dirname(__file__), '..', '..', 'assets')
args = sys.argv[1:]
news = args and args[0] == '--news'
if news: args = args[1:]
slug, files = args[0], args[1:]
out_dir = os.path.join(root, 'news') if news else os.path.join(root, 'cases', slug)
os.makedirs(out_dir, exist_ok=True)
for i, f in enumerate(files, 1):
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    im.thumbnail((2000, 2000))
    name = f'{slug}.webp' if news else f'{i:02d}.webp'
    im.save(os.path.join(out_dir, name), 'WEBP', quality=82, method=6)
    print('saved', os.path.join(out_dir, name), im.size)
