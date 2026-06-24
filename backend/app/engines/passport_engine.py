import io
import os
import math
import textwrap
from PIL import Image, ImageDraw, ImageFont
import httpx
import qrcode
from app.core.config import settings

def _download_image(url: str) -> Image.Image:
    response = httpx.get(url, timeout=30)
    response.raise_for_status()
    return Image.open(io.BytesIO(response.content)).convert("RGBA")

def _hex_to_rgb(hex_color: str) -> tuple:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def _get_font(font_name="georgia.ttf", size=16):
    font_paths = [
        # Windows
        os.path.join("C:\\Windows\\Fonts", font_name),
        # Linux
        os.path.join("/usr/share/fonts/truetype/dejavu", "DejaVuSerif.ttf"),
        os.path.join("/usr/share/fonts/truetype/liberation", "LiberationSerif-Regular.ttf"),
        "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    try:
        return ImageFont.load_default()
    except Exception:
        return None

async def generate_passport(visitor: dict) -> bytes:
    W, H = 1000, 600
    img = Image.new("RGBA", (W, H), (5, 0, 12, 255))
    draw = ImageDraw.Draw(img)

    # 1. Background gradient lines
    for i in range(H):
        alpha = int(255 * (1 - i / H) * 0.25)
        draw.line([(0, i), (W, i)], fill=(124, 58, 237, alpha))

    # 2. Main card borders & design
    aura_hex = visitor.get("aura", {}).get("hex", "#7c3aed")
    aura_rgb = _hex_to_rgb(aura_hex)

    # Draw rounded rectangle for physical card outline
    draw.rounded_rectangle([(30, 30), (970, 570)], radius=24, fill=(10, 1, 24, 255), outline=(250, 204, 21, 255), width=3)

    # Draw top header bar inside card
    draw.rounded_rectangle([(32, 32), (968, 100)], radius=22, fill=(20, 5, 50, 255))
    draw.rectangle([(32, 80), (968, 100)], fill=(20, 5, 50, 255))  # square bottom corners of header
    
    font_h1 = _get_font("georgiab.ttf", 20)
    font_h2 = _get_font("georgia.ttf", 11)
    draw.text((60, 50), "NAKSHATRA NEXUS", fill=(250, 204, 21, 255), font=font_h1)
    draw.text((60, 76), "COSMIC IDENTITY CARD", fill=(167, 139, 250, 255), font=font_h2)
    draw.text((920, 65), "✦", fill=(250, 204, 21, 255), anchor="mm", font=_get_font("georgia.ttf", 28))

    # Draw bottom footer bar inside card
    draw.rounded_rectangle([(32, 500), (968, 568)], radius=22, fill=(20, 5, 50, 255))
    draw.rectangle([(32, 500), (968, 520)], fill=(20, 5, 50, 255))  # square top corners of footer

    dob = visitor.get("date_of_birth", "")
    place = visitor.get("place_of_birth", "")
    font_footer = _get_font("georgia.ttf", 13)
    draw.text((60, 532), f"DOB: {dob}  |  Place: {place}", fill=(167, 139, 250, 200), font=font_footer)
    draw.text((940, 532), "NAKSHATRA NEXUS  |  Cosmic Identity", fill=(167, 139, 250, 200), anchor="rm", font=font_footer)

    # 3. Left Section: Profile Avatar inside Zodiac Frame
    cx, cy = 160, 300
    avatar_url = visitor.get("avatar_url")
    avatar_loaded = False
    
    if avatar_url:
        try:
            avatar = _download_image(avatar_url)
            avatar = avatar.resize((180, 180))
            mask = Image.new("L", (180, 180), 0)
            ImageDraw.Draw(mask).ellipse((0, 0, 180, 180), fill=255)
            
            circular_avatar = Image.new("RGBA", (180, 180), (0, 0, 0, 0))
            circular_avatar.paste(avatar, (0, 0), mask)
            img.paste(circular_avatar, (70, 210), circular_avatar)
            avatar_loaded = True
        except Exception:
            pass

    if not avatar_loaded:
        draw.ellipse([(70, 210), (250, 390)], fill=(40, 20, 80, 255), outline=(250, 204, 21, 255), width=2)
        draw.text((cx, cy), "✦", fill=(250, 204, 21, 255), anchor="mm", font=_get_font("georgia.ttf", 36))

    # Draw Concentric Gold Rings for Zodiac Wheel Frame
    draw.ellipse([(cx - 104, cy - 104), (cx + 104, cy + 104)], outline=(250, 204, 21, 90), width=1)
    draw.ellipse([(cx - 96, cy - 96), (cx + 96, cy + 96)], outline=(250, 204, 21, 220), width=2)
    draw.ellipse([(cx - 90, cy - 90), (cx + 90, cy + 90)], outline=(250, 204, 21, 60), width=1)
    
    for i in range(12):
        angle = (i / 12) * 2 * math.pi
        x1 = cx + 96 * math.cos(angle)
        y1 = cy + 96 * math.sin(angle)
        x2 = cx + 106 * math.cos(angle)
        y2 = cy + 106 * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=(250, 204, 21, 200), width=2)

    # ID Badge below Avatar
    visitor_id = str(visitor.get("_id") or visitor.get("id") or "")
    short_id = visitor_id[-8:].upper() if visitor_id else "NEXUS"
    passport_id = f"NK-{short_id}"
    
    draw.rounded_rectangle([(cx - 70, 420), (cx + 70, 446)], radius=6, fill=(40, 20, 80, 255), outline=(250, 204, 21, 180), width=1)
    draw.text((cx, 432), f"ID: {passport_id}", fill=(250, 204, 21, 255), anchor="mm", font=_get_font("georgia.ttf", 11))

    # 4. Center Section: Profile Details
    font_name = _get_font("georgiab.ttf", 26)
    font_label = _get_font("georgia.ttf", 10)
    font_value = _get_font("georgiab.ttf", 16)
    
    name = visitor.get("full_name", "Cosmic Soul").upper()
    draw.text((300, 130), name, fill=(250, 204, 21, 255), font=font_name)
    draw.line([(300, 172), (700, 172)], fill=(124, 58, 237, 100), width=1)

    rows_data = [
        {"label": "ZODIAC", "value": visitor.get("zodiac", {}).get("sign", "Unknown"), "x": 300, "y": 190},
        {"label": "NAKSHATRA", "value": visitor.get("nakshatra", {}).get("nakshatra", "Unknown"), "x": 300, "y": 260},
        {"label": "AURA", "value": visitor.get("aura", {}).get("color", "Unknown"), "x": 300, "y": 330},
        {"label": "SPIRIT ANIMAL", "value": visitor.get("spirit_animal", {}).get("animal", "Unknown"), "x": 520, "y": 190},
        {"label": "ARCHETYPE", "value": visitor.get("archetype", {}).get("archetype", "Unknown"), "x": 520, "y": 260},
    ]

    for row in rows_data:
        draw.text((row["x"], row["y"]), row["label"], fill=(167, 139, 250, 180), font=font_label)
        draw.text((row["x"], row["y"] + 18), row["value"], fill=(255, 255, 255, 255), font=font_value)

    draw.text((300, 410), '"Your cosmic identity, always with you"', fill=(167, 139, 250, 140), font=_get_font("georgia.ttf", 13))

    # 5. Right Section: QR Code on the fly
    try:
        frontend_url = settings.BASE_URL.rstrip("/")
        qr_data = f"{frontend_url}/passport/{visitor_id}"
        
        qr = qrcode.QRCode(version=1, box_size=4, border=1)
        qr.add_data(qr_data)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color=(250, 204, 21), back_color=(10, 1, 24)).convert("RGBA")
        qr_img = qr_img.resize((150, 150))
        
        # Paste QR code frame and QR
        draw.rounded_rectangle([(760, 180), (930, 350)], radius=12, fill=(10, 1, 24, 255), outline=(250, 204, 21, 150), width=2)
        img.paste(qr_img, (770, 190), qr_img)
        
        font_scan = _get_font("georgia.ttf", 9)
        draw.text((845, 370), "✦ SCAN TO VERIFY ✦", fill=(250, 204, 21, 220), anchor="mm", font=font_scan)
    except Exception as e:
        print("QR overlay generation error:", e)

    final = img.convert("RGB")
    buffer = io.BytesIO()
    final.save(buffer, format="JPEG", quality=95)
    return buffer.getvalue()