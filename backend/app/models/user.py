from sqlalchemy import Column, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

# Association Table for User <-> Farm assignments
user_farms = Table(
    "user_farms",
    Base.metadata,
    Column("user_id", String(50), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("farm_id", String(50), ForeignKey("farms.id", ondelete="CASCADE"), primary_key=True),
    Column("assigned_at", DateTime, default=lambda: datetime.now(timezone.utc))
)

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    area = Column(String(100), nullable=True)
    role = Column(String(20), nullable=False, default="farmer") # 'admin' or 'farmer'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Assigned farms relationship
    assigned_farms = relationship("Farm", secondary=user_farms, back_populates="assigned_users")
