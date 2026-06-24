import resend
from app.core.config import settings

def _safe_get(visitor, *keys, default=""):
    val = visitor
    for k in keys:
        if not isinstance(val, dict):
            return default
        val = val.get(k, default)
    return val or default

def send_cosmic_passport_email(visitor: dict) -> bool:
    resend.api_key = settings.RESEND_API_KEY
    name         = visitor.get("full_name", "Cosmic Traveler")
    email        = visitor.get("email", "")
    passport_url = visitor.get("passport_url", "")
    avatar_url   = visitor.get("avatar_url", "")
    zodiac    = _safe_get(visitor, "zodiac",        "sign")
    nakshatra = _safe_get(visitor, "nakshatra",     "nakshatra")
    aura      = _safe_get(visitor, "aura",          "color")
    animal    = _safe_get(visitor, "spirit_animal", "animal")
    archetype = _safe_get(visitor, "archetype",     "archetype")

    if not email:
        print("Email send skipped: no email address")
        return False

    rows = [
        ("ZODIAC SIGN",   zodiac),
        ("NAKSHATRA",     nakshatra),
        ("AURA COLOR",    aura),
        ("SPIRIT ANIMAL", animal),
        ("ARCHETYPE",     archetype),
    ]

    rows_html = "".join(
        f'<tr><td style="padding:8px 0;color:#a78bfa;font-size:12px;letter-spacing:2px;">{label}</td>'
        f'<td style="color:#facc15;font-size:14px;text-align:right;">{value}</td></tr>'
        for label, value in rows if value
    )

    avatar_html = (
        f'<div style="text-align:center;margin:16px 0;">'
        f'<img src="{avatar_url}" style="width:140px;height:140px;border-radius:50%;border:2px solid #facc15;object-fit:cover;"/></div>'
    ) if avatar_url else ""

    passport_html = (
        f'<div style="text-align:center;margin:24px 0;">'
        f'<img src="{passport_url}" style="max-width:100%;border-radius:12px;"/></div>'
        f'<div style="text-align:center;margin:32px 0;">'
        f'<a href="{passport_url}" style="background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;letter-spacing:2px;">VIEW YOUR COSMIC PASSPORT</a></div>'
    ) if passport_url else ""

    html = f"""<html><head><meta charset="UTF-8"></head>
<body style="background:#0a0118;color:#fff;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;margin-bottom:24px;">
<h1 style="color:#facc15;font-size:28px;letter-spacing:6px;margin:0;">NAKSHATRA NEXUS</h1>
<p style="color:#a78bfa;font-size:12px;letter-spacing:4px;margin:8px 0 0;">COSMIC IDENTITY PASSPORT</p>
</div>
{avatar_html}
<p style="color:#c4b5fd;font-size:16px;">Dear <strong style="color:#facc15;">{name}</strong>,</p>
<p style="color:#c4b5fd;font-size:14px;">The cosmos has revealed your true identity.</p>
<div style="background:linear-gradient(135deg,#1a0533,#2d1b69);border:1px solid #7c3aed44;border-radius:16px;padding:24px;margin:24px 0;">
<table style="width:100%;border-collapse:collapse;">{rows_html}</table>
</div>
{passport_html}
<p style="color:#6b21a8;font-size:11px;text-align:center;margin-top:40px;">NAKSHATRA NEXUS - YOUR COSMIC IDENTITY AWAITS</p>
</div></body></html>"""

    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email],
            "subject": f"Your Cosmic Passport is Ready, {name}",
            "html": html,
        })
        return True
    except Exception as e:
        print(f"[email_engine] send failed: {e}")
        return False
