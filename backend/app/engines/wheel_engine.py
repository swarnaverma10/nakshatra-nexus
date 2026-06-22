import random

WHEEL_SEGMENTS = [
    {"segment": "Cosmic Fortune", "reward": "The stars align in your favor. Abundance flows toward you in unexpected ways.", "color": "#FFD700", "icon": "star"},
    {"segment": "Celestial Power", "reward": "Ancient cosmic power awakens within you. Your manifestation abilities are amplified 10x.", "color": "#9B59B6", "icon": "lightning"},
    {"segment": "Lunar Blessing", "reward": "The Moon grants you heightened intuition. Trust every instinct for the next lunar cycle.", "color": "#C0C0C0", "icon": "moon"},
    {"segment": "Solar Glory", "reward": "The Sun crowns you with visibility and recognition. Your moment to shine has arrived.", "color": "#FFA500", "icon": "sun"},
    {"segment": "Galactic Wisdom", "reward": "A download of cosmic wisdom activates. Solutions to your deepest questions emerge.", "color": "#00BFFF", "icon": "galaxy"},
    {"segment": "Sacred Love", "reward": "Venus blesses your heart chakra. Love in all its forms rushes toward you now.", "color": "#FF69B4", "icon": "heart"},
    {"segment": "Karma Reset", "reward": "The universe wipes your karmic slate. You begin a powerful new chapter, unburdened.", "color": "#50C878", "icon": "infinity"},
    {"segment": "Destiny Unlock", "reward": "A hidden door in your destiny opens. Step through, your highest timeline awaits.", "color": "#FF4444", "icon": "key"},
    {"segment": "Ancestor Power", "reward": "Your ancestors stand behind you, lending their strength. You are never alone.", "color": "#8B4513", "icon": "tree"},
    {"segment": "Stardust Activation", "reward": "Your cosmic DNA activates. Dormant gifts and talents begin to surface now.", "color": "#4B0082", "icon": "sparkle"},
    {"segment": "Phoenix Rising", "reward": "From every ending, you rise stronger. Your transformation is already written in the stars.", "color": "#FF6B35", "icon": "fire"},
    {"segment": "Cosmic Shield", "reward": "Divine protection surrounds you. No negative energy can penetrate your cosmic armor.", "color": "#20B2AA", "icon": "shield"},
]


def spin_cosmic_wheel() -> dict:
    chosen = random.choice(WHEEL_SEGMENTS).copy()
    chosen["spin_index"] = WHEEL_SEGMENTS.index(random.choice(WHEEL_SEGMENTS))
    chosen["total_segments"] = len(WHEEL_SEGMENTS)
    return chosen


def get_all_segments() -> list:
    return WHEEL_SEGMENTS