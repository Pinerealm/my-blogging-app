from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.users import current_active_user
from app.db.session import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.user import UserRead, UserPublicProfile, UserProfileUpdate
from app.schemas.post import PostRead

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def get_current_user_profile(current_user: User = Depends(current_active_user)):
    """Get the current user's profile"""
    return current_user


@router.put("/me", response_model=UserRead)
async def update_current_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db),
):
    """Update the current user's profile"""
    # Update profile fields
    for field, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{username}", response_model=UserPublicProfile)
async def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """Get public user profile by username for author pages"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.get("/{username}/posts", response_model=List[PostRead])
async def get_user_posts(
    username: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    """Get posts by a specific user for their author page"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    posts = (
        db.query(Post)
        .filter(Post.author_id == user.id)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return posts


@router.get("/{username}/stats")
async def get_user_stats(username: str, db: Session = Depends(get_db)):
    """Get user statistics for their profile/author page"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    post_count = (
        db.query(func.count(Post.id)).filter(Post.author_id == user.id).scalar()
    )

    return {
        "username": user.username,
        "total_posts": post_count,
        "joined_date": user.created_at,
    }
