from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.users import current_active_user
from app.db.session import SessionLocal
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostCreate, PostRead, PostUpdate

router = APIRouter()


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[PostRead])
def get_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all posts with pagination."""
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts


@router.get("/{post_id}", response_model=PostRead)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """Get a specific post by ID."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new post (requires authentication)."""
    post = Post(
        title=post_data.title,
        content=post_data.content,
        author_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=PostRead)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db),
):
    """Update a post (only by the author)."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if the current user is the author
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")

    # Update post fields
    if post_data.title is not None:
        post.title = post_data.title
    if post_data.content is not None:
        post.content = post_data.content

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db),
):
    """Delete a post (only by the author)."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if the current user is the author
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this post"
        )

    db.delete(post)
    db.commit()


@router.get("/user/{user_id}", response_model=List[PostRead])
def get_user_posts(
    user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all posts by a specific user."""
    posts = (
        db.query(Post).filter(Post.author_id == user_id).offset(skip).limit(limit).all()
    )
    return posts
