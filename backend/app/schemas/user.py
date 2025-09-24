from fastapi_users import schemas
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class UserRead(schemas.BaseUser[int]):
    id: int
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserUpdate(schemas.BaseUserUpdate):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    website: str | None = None
    location: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    is_verified: bool | None = None


class UserPublicProfile(BaseModel):
    """Public profile for author pages - excludes sensitive information"""

    id: int
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """Schema for profile updates - excludes email/password/admin fields"""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
