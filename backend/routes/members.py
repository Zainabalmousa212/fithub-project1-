 # backend/routes/members.py
from flask import Blueprint, jsonify
from models import SessionLocal
from models.user import User

bp = Blueprint("members", __name__)

@bp.get("/")
def list_members():
    db = SessionLocal()
    try:
        members = db.query(User).filter(User.role == "member").all()
        return jsonify([
            {
                "id": m.id,
                "name": m.full_name,
                "email": m.email,
                "phone": "+966 55 000 0000",   # لو تبين حقول إضافية لاحقًا
                "joined": "Jan 2025",
                "attendance": 90,
                "lastActive": "Today",
                "status": "Active",
            } for m in members
        ])
    finally:
        db.close()
