# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from routes import register_routes
from models import Base, engine

load_dotenv()

def create_app() -> Flask:
    app = Flask(__name__)

    # ===== App Config =====
    # مفتاح JWT (غيّريه في .env:  JWT_SECRET=قيمة_سرية_طويلة)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "change-me")
    # تعطيل ترتيب مفاتيح JSON تلقائياً (اختياري)
    app.config["JSON_SORT_KEYS"] = False
    # Allow JWT identity to be a dict/JSON object
    app.config["JWT_JSON_KEY"] = "sub"
    app.config["JWT_IDENTITY_CLAIM"] = "sub"

    # ===== CORS =====
    # نسمح للفرونت إكسس على /api/*
    # لو عندك دومين محدد اكتبيه بدل "*"
    CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:8082",
        "http://127.0.0.1:8082",
        "http://localhost:8083",
        "http://127.0.0.1:8083"
    ]}},
    supports_credentials=True,
    expose_headers=["Authorization"],
    allow_headers=["Content-Type", "Authorization"],
)

    # ===== JWT =====
    JWTManager(app)

    # ===== DB =====
    # إنشاء الجداول لو ما كانت موجودة
    Base.metadata.create_all(bind=engine)

    # ===== Health Check =====
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    # ===== Register Blueprints (/api/...) =====
    register_routes(app)

    # ===== Error Handlers (اختياري لكنه مفيد أثناء التطوير) =====
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "server error", "detail": str(e)}), 500

    return app


app = create_app()

if __name__ == "__main__":
    # شغّلي الباك على 0.0.0.0:5000
    app.run(host="0.0.0.0", port=5000, debug=True)
