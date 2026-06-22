ZODIAC_SPIRIT_ANIMAL = {
    "Aries": {
        "animal": "Wolf",
        "description": "The Wolf is your spirit guide — fierce, loyal, and a natural leader of the pack. You charge into life with courage and instinct.",
        "power": "Leadership & Courage",
        "element": "Fire",
    },
    "Taurus": {
        "animal": "Bear",
        "description": "The Bear walks beside you — powerful, grounded, and deeply connected to the Earth. You protect what you love with unwavering strength.",
        "power": "Strength & Stability",
        "element": "Earth",
    },
    "Gemini": {
        "animal": "Fox",
        "description": "The Fox is your cosmic companion — clever, curious, and always two steps ahead. Your mind dances between worlds.",
        "power": "Wit & Adaptability",
        "element": "Air",
    },
    "Cancer": {
        "animal": "Turtle",
        "description": "The Turtle carries your soul — ancient, protected, and deeply intuitive. You carry your home within your heart.",
        "power": "Intuition & Protection",
        "element": "Water",
    },
    "Leo": {
        "animal": "Lion",
        "description": "The Lion roars through your spirit — majestic, bold, and born to shine. The cosmos crowned you royalty.",
        "power": "Majesty & Radiance",
        "element": "Fire",
    },
    "Virgo": {
        "animal": "Owl",
        "description": "The Owl watches through your eyes — wise, precise, and keeper of sacred knowledge. You see what others cannot.",
        "power": "Wisdom & Clarity",
        "element": "Earth",
    },
    "Libra": {
        "animal": "Swan",
        "description": "The Swan glides through your essence — graceful, balanced, and eternally beautiful. You bring harmony wherever you flow.",
        "power": "Grace & Balance",
        "element": "Air",
    },
    "Scorpio": {
        "animal": "Phoenix",
        "description": "The Phoenix burns within you — dying and reborn in every moment. Your power comes from transformation itself.",
        "power": "Transformation & Rebirth",
        "element": "Water",
    },
    "Sagittarius": {
        "animal": "Horse",
        "description": "The Horse gallops through your veins — free, adventurous, and wild. No horizon is too far for your spirit.",
        "power": "Freedom & Adventure",
        "element": "Fire",
    },
    "Capricorn": {
        "animal": "Mountain Goat",
        "description": "The Mountain Goat scales your path — determined, patient, and unstoppable. You were born to reach the summit.",
        "power": "Determination & Mastery",
        "element": "Earth",
    },
    "Aquarius": {
        "animal": "Eagle",
        "description": "The Eagle soars through your vision — far-sighted, independent, and touched by lightning. You see the future from above.",
        "power": "Vision & Independence",
        "element": "Air",
    },
    "Pisces": {
        "animal": "Dolphin",
        "description": "The Dolphin swims through your dreams — playful, psychic, and bridging worlds. You are the universe dreaming of itself.",
        "power": "Empathy & Magic",
        "element": "Water",
    },
}


def calculate_spirit_animal(zodiac_sign: str) -> dict:
    return ZODIAC_SPIRIT_ANIMAL.get(zodiac_sign, ZODIAC_SPIRIT_ANIMAL["Aries"])