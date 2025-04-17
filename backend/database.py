import psycopg2
import json

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        user="postgres",    # Using postgres consistently
        password="sudharshan",
        dbname="emotion_analysis_db"
    )

# Function to save user input and analysis results
def save_emotion_record(text, emotions):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Ensure the table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emotions (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            emotions JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Convert to proper JSON string
    emotions_json = json.dumps(emotions)
    
    # Insert data
    cursor.execute("INSERT INTO emotions (text, emotions) VALUES (%s, %s)", (text, emotions_json))
    conn.commit()
    conn.close()

# Function to initialize the database (run once during setup)
def init_database():
    # Connect to default PostgreSQL database first
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",    # Changed from "sudharshan" to "postgres"
        password="sudharshan",
        dbname="postgres"  # Default database
    )
    conn.autocommit = True  # Required for CREATE DATABASE
    cursor = conn.cursor()
    
    # Check if our database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'emotion_analysis_db'")
    exists = cursor.fetchone()
    
    # Create database if it doesn't exist
    if not exists:
        print("Creating database 'emotion_analysis_db'...")
        cursor.execute("CREATE DATABASE emotion_analysis_db")
        print("Database created successfully!")
    else:
        print("Database 'emotion_analysis_db' already exists.")
    
    cursor.close()
    conn.close()
