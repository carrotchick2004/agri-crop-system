from app.routers.auth import router as auth_router
from app.routers.farms import router as farms_router
from app.routers.predict import router as predict_router

__all__ = ["auth_router", "farms_router", "predict_router"]
