from flask import Blueprint, request, jsonify
from backend.emotion_detector import detect_emotion
from backend.database import save_emotion_record

routes = Blueprint("routes", __name__)

@routes.route("/analyze_text", methods=["POST"])
def analyze_text():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    emotions = detect_emotion(text)

    # Save to MySQL
    save_emotion_record(text, emotions)

    return jsonify({"emotions": emotions})
