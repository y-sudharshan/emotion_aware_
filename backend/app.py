from flask import Flask, request, jsonify
from flask_cors import CORS
from emotion_detector import detect_emotion
from database import save_emotion_record, get_db_connection, init_database  # Added init_database import

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Test database connection on startup
    try:
        init_database()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        print("✅ Database connection successful!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")

    @app.route('/analyze_text', methods=['POST'])
    def analyze_text():
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
            
        text = data['text']
        emotions = detect_emotion(text)
        
        # Save the analysis results to the database
        try:
            save_emotion_record(text, emotions)
            print(f"✅ Successfully saved to database: {text[:30]}...")
        except Exception as e:
            error_msg = f"Database error: {str(e)}"
            print(f"❌ {error_msg}")
            app.logger.error(error_msg)
            # Continue even if database saving fails
        
        return jsonify({"emotions": emotions})
    
    @app.route('/health', methods=['GET'])
    def health_check():
        # Also check database connection in health check
        db_status = "connected"
        try:
            conn = get_db_connection()
            conn.cursor().execute("SELECT 1")
            conn.close()
        except Exception as e:
            db_status = f"disconnected: {str(e)}"
            
        return jsonify({"status": "ok", "database": db_status})
        
    return app

# Create the app instance
app = create_app()

# Add this conditional to run the server when the script is executed directly
if __name__ == "__main__":
    app.run(debug=True, port=5000)