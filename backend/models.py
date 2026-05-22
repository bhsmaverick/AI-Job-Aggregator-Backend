from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, timezone

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subscription = relationship("Subscription", back_populates="user", uselist=False)
    saved_jobs = relationship("SavedJob", back_populates="user")

class Subscription(Base):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    plan_name = Column(String, nullable=False)  # e.g., 'basic', 'premium'
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)

    user = relationship("User", back_populates="subscription")

class SavedJob(Base):
    __tablename__ = 'saved_jobs'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    job_id = Column(String, nullable=False) # Reference to Elasticsearch document ID
    saved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="saved_jobs")
