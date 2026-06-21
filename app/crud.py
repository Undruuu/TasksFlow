from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List

from models import User, Task, TaskStatus
from schemas import UserCreate, TaskCreate, TaskUpdate
from auth import get_password_hash

# --- CRUD для пользователей ---
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- CRUD для задач ---
def get_tasks(db: Session, user_id: int, status: Optional[TaskStatus] = None) -> List[Task]:
    query = db.query(Task).filter(Task.owner_id == user_id)
    if status:
        query = query.filter(Task.status == status)
    return query.order_by(Task.created_at.desc()).all()

def get_task(db: Session, task_id: int, user_id: int) -> Optional[Task]:
    return db.query(Task).filter(
        and_(Task.id == task_id, Task.owner_id == user_id)
    ).first()

def create_task(db: Session, task_data: TaskCreate, user_id: int) -> Task:
    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        deadline=task_data.deadline,
        owner_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, user_id: int, task_data: TaskUpdate) -> Optional[Task]:
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int) -> bool:
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True