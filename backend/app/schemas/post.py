from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class AuthorRead(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class PostRead(PostBase):
    id: int
    author_id: int
    created_at: datetime
    author: Optional[AuthorRead] = None

    class Config:
        from_attributes = True
