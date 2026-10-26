import os
import logging
from pathlib import Path
from typing import List, Dict, Any

logger = logging.getLogger("agricorp.ml")

CROPS_CATALOG = [
    {
        "id": "crop_1",
        "name": "ผักกาดขาว",
        "imageIcon": "🥬",
        "optimal_ph": (6.0, 7.0),
        "optimal_temp": (20, 28),
        "optimal_humidity": (60, 80),
        "base_yield": 2.5,
        "cycleDays": 45,
        "description": "ชอบอากาศเย็นชุ่มชื้น ดินร่วนระบายน้ำดี"
    },
    {
        "id": "crop_2",
        "name": "แตงกวาญี่ปุ่น",
        "imageIcon": "🥒",
        "optimal_ph": (5.5, 6.8),
        "optimal_temp": (22, 30),
        "optimal_humidity": (65, 85),
        "base_yield": 1.8,
        "cycleDays": 60,
        "description": "ต้องการน้ำสม่ำเสมอ แสงแดดพอเหมาะ"
    },
    {
        "id": "crop_3",
        "name": "กะหล่ำปลี",
        "imageIcon": "🟢",
        "optimal_ph": (6.0, 6.8),
        "optimal_temp": (18, 25),
        "optimal_humidity": (60, 75),
        "base_yield": 3.0,
        "cycleDays": 55,
        "description": "ทนทาน อากาศเย็นให้ผลผลิตสูง"
    },
    {
        "id": "crop_4",
        "name": "เบบี้คอส",
        "imageIcon": "🍀",
        "optimal_ph": (6.0, 7.2),
        "optimal_temp": (18, 26),
        "optimal_humidity": (50, 70),
        "base_yield": 4.5,
        "cycleDays": 40,
        "description": "ตลาดต้องการสูง ผลตอบแทนดี"
    },
    {
        "id": "crop_5",
        "name": "มะเขือเทศ",
        "imageIcon": "🍅",
        "optimal_ph": (6.0, 6.8),
        "optimal_temp": (21, 29),
        "optimal_humidity": (55, 75),
        "base_yield": 5.2,
        "cycleDays": 70,
        "description": "ชอบแดดจัด ระวังน้ำขังบริเวณราก"
    }
]

class MLService:
    def __init__(self):
        self.model = None
        self.model_name = "Heuristic Agronomic Model"
        self._load_model()

    def _load_model(self):
        # Look for joblib models
        model_paths = [
            Path(__file__).resolve().parent.parent / "ml_models" / "ai_model.joblib",
            Path(__file__).resolve().parent.parent / "ml_models" / "random_forest_model.joblib",
        ]
        for path in model_paths:
            if path.exists():
                try:
                    import joblib
                    self.model = joblib.load(path)
                    self.model_name = f"Random Forest ({path.name})"
                    logger.info("Successfully loaded ML model from %s", path)
                    return
                except Exception as e:
                    logger.warning("Could not load joblib model at %s: %s", path, e)

    def predict_crops(self, ph: float, temp: float, humidity: float, water: float = 800.0) -> List[Dict[str, Any]]:
        results = []
        for crop in CROPS_CATALOG:
            # Calculate match score based on distance from optimal conditions
            ph_low, ph_high = crop["optimal_ph"]
            ph_penalty = abs(ph - (ph_low + ph_high) / 2) * 12

            t_low, t_high = crop["optimal_temp"]
            temp_penalty = abs(temp - (t_low + t_high) / 2) * 2

            h_low, h_high = crop["optimal_humidity"]
            h_penalty = abs(humidity - (h_low + h_high) / 2) * 0.8

            raw_score = 100 - (ph_penalty + temp_penalty + h_penalty)
            match_score = max(40, min(98, int(round(raw_score))))

            # Yield estimation influenced by match score
            yield_multiplier = match_score / 100.0
            est_yield = round(crop["base_yield"] * yield_multiplier, 2)

            results.append({
                "id": crop["id"],
                "name": crop["name"],
                "imageIcon": crop["imageIcon"],
                "matchScore": match_score,
                "estimatedYield": est_yield,
                "cycleDays": crop["cycleDays"],
                "description": crop["description"]
            })

        # Sort by highest match score
        results.sort(key=lambda x: x["matchScore"], reverse=True)
        return results

ml_service = MLService()
