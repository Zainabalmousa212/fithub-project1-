 # backend/routes/trainers.py
from flask import Blueprint, jsonify
from models import SessionLocal
from models.user import User

bp = Blueprint("trainers", __name__)

@bp.get("/me")
def me():
    # مبدئيًا هنرجّع أول ترينر (أو لاحقًا نستخرج من التوكن)
    db = SessionLocal()
    try:
        trainer = db.query(User).filter(User.role == "trainer").first()
        if not trainer:
            return jsonify({"error": "No trainer found"}), 404

        return jsonify({
            "fullName": trainer.full_name,
            "email": trainer.email,
            "phone": "+966 XXX XXXX",
            "specialization": "HIIT & Strength Training",
            "certification": "ACE Certified Personal Trainer",
            "since": "Oct 2024",
            "stats": {"activeMembers": 32, "totalSessions": 284, "rating": 4.9, "years": "5+ years"}
        })
    finally:
        db.close()
