import httpx
import urllib.parse

AVATAR_PROMPT_TEMPLATE = (
    "majestic cosmic portrait avatar, ethereal galaxy and nebula background, "
    "glowing stardust particles, ornate celestial jewelry, mystical aura lighting, "
    "digital fantasy art style, highly detailed, vibrant purple and gold color palette"
)


async def generate_avatar_from_selfie(selfie_url: str) -> bytes:
    """
    Uses Pollinations.ai (free, no API key required) to generate a cosmic avatar.
    """
    encoded_prompt = urllib.parse.quote(AVATAR_PROMPT_TEMPLATE)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=768&height=768&nologo=true&model=flux"

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content
