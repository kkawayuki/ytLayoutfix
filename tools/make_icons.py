#!/usr/bin/env python3

import struct
import zlib
from pathlib import Path

SIZES = [16, 32, 48, 128]
# Chrome Web Store guidelines: the 128px icon's artwork is 96x96 with 16px of
# transparent padding. The smaller toolbar sizes use the full canvas.
PADDING = {128: 16}
OUT_DIR = Path(__file__).resolve().parent.parent / 'icons'

BG = (79, 70, 229, 255)  # indigo, deliberately not YouTube red
WHITE = (255, 255, 255, 255)
SOFT = (255, 255, 255, 170)

# (x0, y0, x1, y1, corner radius, rgba) on the 128 grid, drawn in order.
FULL = [
    (0, 0, 128, 128, 28, BG),
    (18, 30, 84, 68, 6, WHITE),  # video
    (18, 76, 84, 82, 3, SOFT),  # title / description lines
    (18, 88, 66, 94, 3, SOFT),
    (92, 30, 110, 42, 3, WHITE),  # recommendations column
    (92, 48, 110, 60, 3, WHITE),
    (92, 66, 110, 78, 3, WHITE),
    (92, 84, 110, 96, 3, WHITE),
]

# At 16px the small pieces turn to mush, so use chunkier, fewer shapes.
SIMPLE = [
    (0, 0, 128, 128, 24, BG),
    (16, 32, 84, 72, 8, WHITE),
    (16, 84, 84, 96, 6, SOFT),
    (92, 32, 112, 52, 6, WHITE),
    (92, 60, 112, 80, 6, WHITE),
]


def inside(px, py, shape):
    x0, y0, x1, y1, r, _ = shape
    if not (x0 <= px <= x1 and y0 <= py <= y1):
        return False
    # Distance to the nearest corner circle center, if in a corner region.
    cx = min(max(px, x0 + r), x1 - r)
    cy = min(max(py, y0 + r), y1 - r)
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r


def render(size, shapes, pad=0, ss=4):
    scale = 128 / (size - 2 * pad)
    rows = []
    for y in range(size):
        row = bytearray([0])  # PNG filter type 0 for this row
        for x in range(size):
            # Composite each shape over the pixel using its coverage (premultiplied).
            r = g = b = a = 0.0
            for shape in shapes:
                hits = sum(
                    inside((x - pad + (i + 0.5) / ss) * scale, (y - pad + (j + 0.5) / ss) * scale, shape)
                    for i in range(ss)
                    for j in range(ss)
                )
                if not hits:
                    continue
                sa = shape[5][3] / 255 * hits / (ss * ss)
                r = shape[5][0] * sa + r * (1 - sa)
                g = shape[5][1] * sa + g * (1 - sa)
                b = shape[5][2] * sa + b * (1 - sa)
                a = sa + a * (1 - sa)
            if a:
                row += bytes([round(r / a), round(g / a), round(b / a), round(a * 255)])
            else:
                row += bytes(4)
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)  # 8-bit RGBA
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b'')
    path.write_bytes(png)


if __name__ == '__main__':
    OUT_DIR.mkdir(exist_ok=True)
    for size in SIZES:
        path = OUT_DIR / f'icon{size}.png'
        write_png(path, size, render(size, SIMPLE if size <= 16 else FULL, PADDING.get(size, 0)))
        print(path.relative_to(OUT_DIR.parent))
