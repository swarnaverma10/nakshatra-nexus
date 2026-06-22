ZODIAC_AURA = {
    "Aries": {"color": "Red", "hex": "#FF4444", "meaning": "Passionate, energetic, and bold. Your aura burns with the fire of a cosmic warrior."},
    "Taurus": {"color": "Emerald Green", "hex": "#50C878", "meaning": "Grounded, abundant, and deeply connected to Earth's wisdom."},
    "Gemini": {"color": "Yellow", "hex": "#FFD700", "meaning": "Radiant and intellectual. Your aura shimmers with curiosity and quick wit."},
    "Cancer": {"color": "Silver", "hex": "#C0C0C0", "meaning": "Intuitive and nurturing. Your aura glows with the gentle light of the Moon."},
    "Leo": {"color": "Golden Orange", "hex": "#FFA500", "meaning": "Majestic and radiant. Your aura blazes like the Sun itself."},
    "Virgo": {"color": "Indigo", "hex": "#4B0082", "meaning": "Pure and analytical. Your aura resonates with sacred geometric precision."},
    "Libra": {"color": "Rose Pink", "hex": "#FF69B4", "meaning": "Harmonious and graceful. Your aura radiates divine balance and love."},
    "Scorpio": {"color": "Deep Crimson", "hex": "#8B0000", "meaning": "Intense and transformative. Your aura pulses with the power of rebirth."},
    "Sagittarius": {"color": "Purple", "hex": "#9B59B6", "meaning": "Expansive and philosophical. Your aura stretches toward infinite horizons."},
    "Capricorn": {"color": "Dark Brown", "hex": "#8B4513", "meaning": "Disciplined and ancient. Your aura carries the wisdom of mountain peaks."},
    "Aquarius": {"color": "Electric Blue", "hex": "#00BFFF", "meaning": "Revolutionary and visionary. Your aura crackles with cosmic electricity."},
    "Pisces": {"color": "Sea Green", "hex": "#20B2AA", "meaning": "Mystical and empathetic. Your aura flows like the cosmic ocean."},
}

NAKSHATRA_AURA_BOOST = {
    "Ashwini": "Amplified with swift cosmic energy",
    "Bharani": "Deepened with transformative fire",
    "Krittika": "Sharpened with stellar precision",
    "Rohini": "Softened with divine beauty",
    "Mrigashira": "Heightened with cosmic curiosity",
    "Ardra": "Charged with storm energy",
    "Punarvasu": "Renewed with celestial light",
    "Pushya": "Nourished with sacred waters",
    "Ashlesha": "Empowered with serpent wisdom",
    "Magha": "Crowned with ancestral power",
    "Purva Phalguni": "Blessed with creative joy",
    "Uttara Phalguni": "Illuminated with solar grace",
    "Hasta": "Gifted with healing hands",
    "Chitra": "Adorned with cosmic artistry",
    "Swati": "Freed with wind-like independence",
    "Vishakha": "Focused with unwavering purpose",
    "Anuradha": "United with devotional love",
    "Jyeshtha": "Fortified with elder wisdom",
    "Mula": "Rooted in cosmic foundation",
    "Purva Ashadha": "Purified by celestial waters",
    "Uttara Ashadha": "Crowned with universal victory",
    "Shravana": "Attuned to cosmic vibrations",
    "Dhanishta": "Rhythmed with universal music",
    "Shatabhisha": "Healed by a hundred stars",
    "Purva Bhadrapada": "Ignited with fierce passion",
    "Uttara Bhadrapada": "Deepened with ocean wisdom",
    "Revati": "Guided by cosmic completion",
}


def calculate_aura(zodiac_sign: str, nakshatra: str) -> dict:
    aura = ZODIAC_AURA.get(zodiac_sign, ZODIAC_AURA["Aries"]).copy()
    boost = NAKSHATRA_AURA_BOOST.get(nakshatra, "Blessed with cosmic light")
    aura["nakshatra_boost"] = boost
    aura["zodiac_sign"] = zodiac_sign
    aura["nakshatra"] = nakshatra
    return aura