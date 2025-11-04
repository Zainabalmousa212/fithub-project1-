 # backend/seed.py
from werkzeug.security import generate_password_hash
from models import SessionLocal, Base, engine
from models.user import User

def seed():
    Base.metadata.create_all(bind=engine)  # يتأكد أن الجداول موجودة

    db = SessionLocal()
    try:
        users = [
            {
                "full_name": "Zainab Almousa",
                "email": "zainab.almousa@fithub.com",
                "password_hash": generate_password_hash("password123"),
                "role": "trainer",
            },
            {
                "full_name": "Fatimah Al-Mousa",
                "email": "fatimah@example.com",
                "password_hash": generate_password_hash("password123"),
                "role": "member",
            },
        ]

        for u in users:
            exists = db.query(User).filter(User.email == u["email"]).first()
            if not exists:
                db.add(User(**u))

        db.commit()
        print("✅ Seed completed successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
