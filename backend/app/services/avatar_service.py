import httpx
import random
import io
import numpy as np
import cv2
from pathlib import Path

import insightface
from insightface.app import FaceAnalysis

TEMPLATES_ROOT = Path(__file__).resolve().parents[3] / "frontend" / "public" / "avatar-templates"
VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

_face_app = None
_swapper = None


def _get_face_app():
    global _face_app
    if _face_app is None:
        _face_app = FaceAnalysis(name="buffalo_l")
        _face_app.prepare(ctx_id=0, det_size=(640, 640))
    return _face_app


def _get_swapper():
    global _swapper
    if _swapper is None:
        model_path = str(Path.home() / ".insightface" / "models" / "inswapper_128.onnx")
        _swapper = insightface.model_zoo.get_model(model_path)
    return _swapper


def _list_all_templates() -> list[Path]:
    templates = []
    if not TEMPLATES_ROOT.exists():
        return templates
    for category_dir in TEMPLATES_ROOT.iterdir():
        if category_dir.is_dir():
            for f in category_dir.iterdir():
                if f.suffix.lower() in VALID_EXTENSIONS:
                    templates.append(f)
    return templates


def _pick_random_template() -> Path:
    templates = _list_all_templates()
    if not templates:
        raise RuntimeError(f"No avatar template images found under {TEMPLATES_ROOT}")
    return random.choice(templates)


def _decode_image(data: bytes):
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise RuntimeError("Failed to decode image")
    return img


async def generate_avatar_from_selfie(selfie_url: str, visitor_data: dict = None) -> bytes:
    if not selfie_url:
        raise RuntimeError("No selfie_url provided for avatar generation")

    template_path = _pick_random_template()
    template_img = cv2.imread(str(template_path))
    if template_img is None:
        raise RuntimeError(f"Failed to read template image: {template_path}")

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.get(selfie_url)
        r.raise_for_status()
        selfie_img = _decode_image(r.content)

    face_app = _get_face_app()
    swapper = _get_swapper()

    selfie_faces = face_app.get(selfie_img)
    if not selfie_faces:
        raise RuntimeError("No face detected in selfie")
    source_face = selfie_faces[0]

    template_faces = face_app.get(template_img)
    if not template_faces:
        raise RuntimeError(f"No face detected in template: {template_path.name}")
    target_face = template_faces[0]

    result_img = swapper.get(template_img, target_face, source_face, paste_back=True)

    success, buffer = cv2.imencode(".jpg", result_img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    if not success:
        raise RuntimeError("Failed to encode result image")

    return buffer.tobytes()
