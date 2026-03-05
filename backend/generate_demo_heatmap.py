from PIL import Image, ImageDraw, ImageFilter
import random
import math

width, height = 400, 400
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Polygon points scaled to 0-400 bounding box
# original coords:
# SW: [101.124687, 3.524300]
# NE: [101.138935, 3.535651]
# width in degrees: 101.138935 - 101.124687 = 0.014248
# height in degrees: 3.535651 - 3.524300 = 0.011351

poly_coords = [
    (101.124687, 3.527513),
    (101.136832, 3.535651),
    (101.138935, 3.532353),
    (101.126747, 3.524300)
]

min_x = 101.124687
max_x = 101.138935
min_y = 3.524300
max_y = 3.535651

def to_pixel(x, y):
    px = int((x - min_x) / (max_x - min_x) * width)
    # y is flipped because screen coords go down
    py = int((1 - (y - min_y) / (max_y - min_y)) * height)
    return px, py

poly_pixels = [to_pixel(x, y) for x, y in poly_coords]

# Draw the polygon with a healthy green first
draw.polygon(poly_pixels, fill=(50, 180, 80, 180))

# Introduce an area of concern (pest attack) 
# Let's put it at roughly the center of the field
center_x = sum([p[0] for p in poly_pixels]) / 4
center_y = sum([p[1] for p in poly_pixels]) / 4

# draw some radial red/yellow patches
for _ in range(5000):
    px = random.randint(0, width)
    py = random.randint(0, height)
    dist = math.hypot(px - center_x - 30, py - center_y - 20)
    
    if dist < 60:
        val = dist / 60
        r = int(220 + 30*val)
        g = int(50 + 100*val)
        b = int(50)
        draw.rectangle([px, py, px+3, py+3], fill=(r, g, b, 230))
    elif dist < 120 and random.random() < 0.3:
        # yellow transition
        draw.rectangle([px, py, px+3, py+3], fill=(210, 180, 40, 200))

# Blur
img = img.filter(ImageFilter.GaussianBlur(8))

# Mask again by polygon so it doesn't spill over
mask = Image.new('L', (width, height), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.polygon(poly_pixels, fill=255)

result = Image.new('RGBA', (width, height))
result.paste(img, (0, 0), mask)

result.save('/Users/khairulazfar/repos/sawahsense/frontend/public/heatmap_f1.png')
print("Saved heatmap to /Users/khairulazfar/repos/sawahsense/frontend/public/heatmap_f1.png")
