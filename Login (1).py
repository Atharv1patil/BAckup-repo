import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from bson import ObjectId
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configure MongoDB connection (use environment variable if available)
mongo_uri = os.getenv("MONGO_URI",
                      "mongodb+srv://atharvp540:w4oWEYdADEznQT4T@clustertest.ryyqg.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest")
client = MongoClient(mongo_uri)
db = client['Campus-placement-system']

# Collections
users_collection = db['Login']
placement_collection = db['Placement_data']
student_collection = db['Student']

# Configure Gemini AI with API Key
genai.configure(api_key="AIzaSyALtRehC2AedEA71lRKHmiiIzErfpSLPek")  # Replace with your actual API key

# -----------------------------------------------
# Home Endpoint
@app.route('/')
def home():
    return "Campus Placement System API"

# -----------------------------------------------
# Authentication Endpoints
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user_data = {
        "username": data['username'],
        "email": data['email'],
        "password": hashed_pw
    }
    result = users_collection.insert_one(user_data)
    return jsonify({
        "message": "User registered successfully",
        "id": str(result.inserted_id)
    }), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Missing email or password"}), 400

    user = users_collection.find_one({"email": data["email"]})
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user['_id']),
            "username": user['username'],
            "email": user['email']
        }
    }), 200

# -----------------------------------------------
# Placement Data Endpoint
@app.route('/placement/<major>', methods=['GET'])
def get_placement_by_major(major):
    data = placement_collection.find_one({"major": major})
    if data:
        data["_id"] = str(data["_id"])
        return jsonify(data), 200
    return jsonify({"error": "Major not found"}), 404

# -----------------------------------------------
# Profile Endpoints
@app.route("/profile/<email>", methods=["GET"])
def get_profile(email):
    student = student_collection.find_one({"email": email}, {"_id": 0})
    if student:
        student["skills"] = student.get("skills", [])
        return jsonify(student), 200
    return jsonify({"error": "Profile not found"}), 404

@app.route("/profile", methods=["POST"])
def save_profile():
    data = request.json
    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400

    data["skills"] = data.get("skills", [])
    student_collection.update_one(
        {"email": data["email"]},
        {"$set": data},
        upsert=True
    )
    return jsonify({"message": "Profile saved successfully!"}), 200

# -----------------------------------------------
# Gemini AI Integration for Skill Recommendations
def get_skill_recommendations(major, skills):
    """
    Query Gemini AI to get recommended skills based on major and existing skills.
    The prompt instructs the model to output a valid JSON array of objects.
    """
    prompt = f"""
    I have a student majoring in {major}. 
    Their current skills are: {', '.join(skills) if skills else 'None'}.

    Suggest the **top 5 most in-demand skills** they should learn to improve their job prospects.
    For each skill, provide:
      1. The **skill name**.
      2. Whether it is a **hard skill** or a **soft skill**.
      3. The **demand level** (e.g., High, Medium, Low).
      4. A **trusted course link** where they can learn it.

    Format the response as a JSON array of objects, like this example:

    [
        {{
            "skillName": "Cloud Computing",
            "skillType": "Hard Skill",
            "demandLevel": "High",
            "courseLink": "https://example.com/cloud-course"
        }},
        {{
            "skillName": "Communication",
            "skillType": "Soft Skill",
            "demandLevel": "High",
            "courseLink": "https://example.com/communication-course"
        }}
    ]

    Ensure the response is valid JSON and do not include any text outside of the JSON.
    """

    model = genai.GenerativeModel("models/gemini-1.5-flash")
    try:
        response = model.generate_content(prompt)
        print("AI Response:", response.text)
        if response and hasattr(response, 'text'):
            try:
                recommended_skills = json.loads(response.text)
                if isinstance(recommended_skills, list):
                    return recommended_skills
                else:
                    return ["Error: AI response was not a valid JSON array."]
            except json.JSONDecodeError:
                json_match = re.search(r"\[.*\]", response.text, re.DOTALL)
                if json_match:
                    try:
                        recommended_skills = json.loads(json_match.group(0))
                        if isinstance(recommended_skills, list):
                            return recommended_skills
                        else:
                            return ["Error: Extracted JSON was not a valid JSON array."]
                    except json.JSONDecodeError:
                        return ["Error: Extracted JSON could not be parsed."]
                else:
                    return ["Error: AI response did not contain valid JSON."]
    except Exception as e:
        print(f"Error in Gemini AI request: {e}")
    return ["No recommendations available"]

@app.route("/profile-ai/<email>", methods=["GET"])
def get_profile_ai(email):
    """
    Fetch student profile and provide AI skill recommendations.
    Combines student data with the AI-generated skill recommendations.
    """
    student = student_collection.find_one({"email": email}, {"_id": 0})
    if student:
        major = student.get("major", "Unknown Major")
        skills = student.get("skills", [])
        recommended_skills = get_skill_recommendations(major, skills)
        student["recommended_skills"] = recommended_skills
        return jsonify(student), 200
    return jsonify({"error": "Profile not found"}), 404

# -----------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
