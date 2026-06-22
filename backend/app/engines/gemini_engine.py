import httpx
from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def generate_gemini_insight(visitor_data: dict) -> str:
    prompt = f"""You are a cosmic astrologer and spiritual guide. Generate a deeply personal, mystical, and inspiring cosmic insight for this person.

Person Details:
- Name: {visitor_data.get('full_name')}
- Zodiac Sign: {visitor_data.get('zodiac', {}).get('sign')}
- Nakshatra: {visitor_data.get('nakshatra', {}).get('nakshatra')}
- Nakshatra Lord: {visitor_data.get('nakshatra', {}).get('lord')}
- Aura Color: {visitor_data.get('aura', {}).get('color')}
- Spirit Animal: {visitor_data.get('spirit_animal', {}).get('animal')}
- Cosmic Archetype: {visitor_data.get('archetype', {}).get('archetype')}
- Cosmic Mission: {visitor_data.get('destiny_vault', {}).get('cosmic_mission')}
- Wheel Result: {visitor_data.get('wheel_result', {}).get('segment')}

Write a 4-5 sentence personalized cosmic insight that:
1. Addresses them by name
2. Connects their zodiac, nakshatra, and spirit animal meaningfully
3. Reveals a specific cosmic truth about their life path
4. Ends with a powerful activation statement

Tone: Mystical, warm, empowering. No bullet points. Pure flowing prose."""

    headers = {
        "Authorization": f"Bearer {settings.GEMINI_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nakshatra-nexus.com",
        "X-Title": "Nakshatra Nexus",
    }

    payload = {
        "model": "meta-llama/llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 400,
        "temperature": 0.9,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"].strip()