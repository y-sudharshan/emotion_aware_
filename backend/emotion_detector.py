from transformers import pipeline

# Load pre-trained Hugging Face emotion model
emotion_pipeline = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

def detect_emotion(text):
    """
    Process text input and return a list of emotions with confidence scores.
    """
    results = emotion_pipeline(text)
    return [{"label": res["label"], "score": round(res["score"] * 100, 2)} for res in results[0]]
