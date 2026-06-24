import qrcode
import io
from PIL import Image, ImageDraw


def generate_qr_image(data: str) -> bytes:
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=3,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color=(250, 204, 21), back_color=(10, 1, 24))

    img_pil = img.convert("RGBA")
    size = img_pil.size[0]

    frame = Image.new("RGBA", (size + 20, size + 20), (10, 1, 24, 255))
    frame.paste(img_pil, (10, 10))

    draw = ImageDraw.Draw(frame)
    mark = 24
    lw = 3
    w, h = frame.size
    for x1, y1, x2, y2 in [
        (4, 4, 4 + mark, 4),             (4, 4, 4, 4 + mark),
        (w-4-mark, 4, w-4, 4),           (w-4, 4, w-4, 4+mark),
        (4, h-4, 4+mark, h-4),           (4, h-4-mark, 4, h-4),
        (w-4-mark, h-4, w-4, h-4),       (w-4, h-4-mark, w-4, h-4),
    ]:
        draw.line([(x1, y1), (x2, y2)], fill=(250, 204, 21), width=lw)

    buffer = io.BytesIO()
    frame.convert("RGB").save(buffer, format="PNG", optimize=True)
    buffer.seek(0)
    return buffer.read()
