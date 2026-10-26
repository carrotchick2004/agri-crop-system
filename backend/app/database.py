import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("agricorp.database")

Base = declarative_base()

def get_engine():
    """Attempt connecting to PostgreSQL, fallback to SQLite if not ready."""
    try:
        # Test connecting to PostgreSQL
        pg_engine = create_engine(
            settings.postgres_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3}
        )
        with pg_engine.connect() as conn:
            pass
        logger.info("Connected successfully to PostgreSQL database (%s).", settings.DB_NAME)
        return pg_engine
    except Exception as e:
        if settings.USE_SQLITE_FALLBACK:
            logger.warning(
                "PostgreSQL connection failed (%s). Falling back to local SQLite database.",
                str(e)
            )
            return create_engine(
                settings.sqlite_url,
                connect_args={"check_same_thread": False}
            )
        raise e

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to provide a transactional database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
