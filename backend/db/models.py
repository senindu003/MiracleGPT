from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, UniqueConstraint, Text
from sqlalchemy.orm import relationship
from backend.db.database import Base

class User(Base):
    __tablename__ = "users"
    firstname = Column(String(255), nullable=False)
    lastname = Column(String(255), nullable=False)
    username = Column(String(255), primary_key=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(Text, nullable=False)

    stories = relationship("Story", back_populates="user")
    usages = relationship("Usage", back_populates="user")

class Story(Base):
    __tablename__ = "stories"
    story_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    author = Column(String(255), ForeignKey("users.username"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    story = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="stories")


class Usage(Base):
    __tablename__ = "usage"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), ForeignKey("users.username"), index=True, nullable=False)
    date = Column(Date, index=True, nullable=False)
    generate_count = Column(Integer, nullable=False, default=0)

    user = relationship("User", back_populates="usages")

    __table_args__ = (
        UniqueConstraint("username", "date", name="uq_usage_user_date"),
    )