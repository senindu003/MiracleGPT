from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import LONGTEXT
from db.database import Base

class User(Base):
    __tablename__ = "users"
    firstname = Column(String(55), nullable=False)
    lastname = Column(String(55), nullable=False)
    username = Column(String(55), primary_key=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(LONGTEXT, nullable=False)

    stories = relationship("Story", back_populates="user")

class Story(Base):
    __tablename__ = "stories"
    story_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    author = Column(String(55), ForeignKey("users.username"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    story = Column(LONGTEXT, nullable=False)
    created_at = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="stories")
