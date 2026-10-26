import os
from pathlib import Path
from dotenv import load_dotenv

# Locate .env in backend directory
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "AgriCorp Smart Agriculture API"
    VERSION: str = "1.0.0"
    
    # Database Settings
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_NAME: str = os.getenv("DB_NAME", "agricorp_db")
    USE_SQLITE_FALLBACK: bool = os.getenv("USE_SQLITE_FALLBACK", "true").lower() == "true"
    
    # Server & Security
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agricorp_super_secret_jwt_key_2026")
    
    # CORS Origins allowed to access API
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @property
    def postgres_url(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def sqlite_url(self) -> str:
        db_path = BASE_DIR / "agricorp_dev.db"
        return f"sqlite:///{db_path}"

settings = Settings()
