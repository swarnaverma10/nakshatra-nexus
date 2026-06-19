import swisseph as swe
from datetime import datetime, date, time
import pytz

# Zodiac signs (Western/Tropical, 30 degrees each)
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

# 27 Nakshatras (Vedic/Sidereal, 13°20' each)
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
]


def _to_julian_day(birth_date: date, birth_time: time, tz_name: str) -> float:
    tz = pytz.timezone(tz_name)
    local_dt = tz.localize(datetime.combine(birth_date, birth_time))
    utc_dt = local_dt.astimezone(pytz.utc)

    hour_decimal = utc_dt.hour + utc_dt.minute / 60 + utc_dt.second / 3600
    return swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal)


def get_zodiac_sign(birth_date: date, birth_time: time, tz_name: str) -> dict:
    """Tropical (Western) Sun sign calculation."""
    jd = _to_julian_day(birth_date, birth_time, tz_name)
    sun_pos = swe.calc_ut(jd, swe.SUN)[0][0]  # longitude in degrees
    sign_index = int(sun_pos // 30)
    degree_in_sign = sun_pos % 30

    return {
        "sign": ZODIAC_SIGNS[sign_index],
        "degree": round(degree_in_sign, 2),
    }


def get_nakshatra(birth_date: date, birth_time: time, tz_name: str, latitude: float, longitude: float) -> dict:
    """Sidereal Moon-based Nakshatra calculation using Lahiri Ayanamsa."""
    jd = _to_julian_day(birth_date, birth_time, tz_name)

    swe.set_sid_mode(swe.SIDM_LAHIRI)
    moon_pos_sidereal = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]

    nakshatra_span = 360 / 27  # 13.333... degrees
    nakshatra_index = int(moon_pos_sidereal // nakshatra_span)
    degree_in_nakshatra = moon_pos_sidereal % nakshatra_span

    pada = int(degree_in_nakshatra // (nakshatra_span / 4)) + 1  # 1-4

    return {
        "nakshatra": NAKSHATRAS[nakshatra_index],
        "lord": NAKSHATRA_LORDS[nakshatra_index],
        "pada": pada,
        "degree": round(degree_in_nakshatra, 2),
    }


def calculate_full_astrology(birth_date: date, birth_time: time, tz_name: str, latitude: float, longitude: float) -> dict:
    zodiac = get_zodiac_sign(birth_date, birth_time, tz_name)
    nakshatra = get_nakshatra(birth_date, birth_time, tz_name, latitude, longitude)

    return {
        "zodiac": zodiac,
        "nakshatra": nakshatra,
    }
