import swisseph as swe
from datetime import datetime, date, time
import pytz
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

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

_geolocator = Nominatim(user_agent="nakshatra-nexus")
_tf = TimezoneFinder()

def _resolve_place(place_of_birth: str) -> tuple:
    """Returns (latitude, longitude, tz_name) from a place name string."""
    location = _geolocator.geocode(place_of_birth, timeout=10)
    if not location:
        # fallback to Delhi
        lat, lon = 28.6139, 77.2090
    else:
        lat, lon = location.latitude, location.longitude
    tz_name = _tf.timezone_at(lat=lat, lng=lon) or "Asia/Kolkata"
    return lat, lon, tz_name

def _to_julian_day(birth_date: date, birth_time: time, tz_name: str) -> float:
    tz = pytz.timezone(tz_name)
    local_dt = tz.localize(datetime.combine(birth_date, birth_time))
    utc_dt = local_dt.astimezone(pytz.utc)
    hour_decimal = utc_dt.hour + utc_dt.minute / 60 + utc_dt.second / 3600
    return swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal)

def get_zodiac_sign(birth_date: date, birth_time: time, tz_name: str) -> dict:
    jd = _to_julian_day(birth_date, birth_time, tz_name)
    sun_pos = swe.calc_ut(jd, swe.SUN)[0][0]
    sign_index = int(sun_pos // 30)
    degree_in_sign = sun_pos % 30
    return {
        "sign": ZODIAC_SIGNS[sign_index],
        "degree": round(degree_in_sign, 2),
    }

def get_nakshatra(birth_date: date, birth_time: time, tz_name: str) -> dict:
    jd = _to_julian_day(birth_date, birth_time, tz_name)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    moon_pos_sidereal = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)[0][0]
    nakshatra_span = 360 / 27
    nakshatra_index = int(moon_pos_sidereal // nakshatra_span)
    degree_in_nakshatra = moon_pos_sidereal % nakshatra_span
    pada = int(degree_in_nakshatra // (nakshatra_span / 4)) + 1
    return {
        "nakshatra": NAKSHATRAS[nakshatra_index],
        "lord": NAKSHATRA_LORDS[nakshatra_index],
        "pada": pada,
        "degree": round(degree_in_nakshatra, 2),
    }

def calculate_full_astrology(birth_date: date, birth_time: time, place_of_birth: str, tz_name: str = None, latitude: float = None, longitude: float = None) -> dict:
    if not tz_name or not latitude or not longitude:
        latitude, longitude, tz_name = _resolve_place(place_of_birth)
    zodiac = get_zodiac_sign(birth_date, birth_time, tz_name)
    nakshatra = get_nakshatra(birth_date, birth_time, tz_name)
    return {
        "zodiac": zodiac,
        "nakshatra": nakshatra,
    }
