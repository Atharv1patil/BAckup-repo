import os
import json
import re
from datetime import datetime
import random

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from bson import ObjectId, json_util
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configure MongoDB connection (use environment variable if available)
mongo_uri = os.getenv(
    "MONGO_URI",
    "mongodb+srv://atharvp540:w4oWEYdADEznQT4T@clustertest.ryyqg.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest"
)
client = MongoClient(mongo_uri)
db = client['Campus-placement-system']

# Collections
users_collection = db['Login']
placement_collection = db['Placement_data']
student_collection = db['Student']
placement_stat_collection = db['Placement_Stat']
# Placement_past will be used in its endpoint directly

# Configure Gemini AI with API Key
genai.configure(api_key="AIzaSyALtRehC2AedEA71lRKHmiiIzErfpSLPek")  # Replace with your actual API key

# -----------------------------------------------
# Helper Functions for Student Endpoints
def map_student(student):
    # Map database fields to frontend expected structure with defaults
    return {
        "id": str(student["_id"]),
        "name": f"{student.get('firstName', '')} {student.get('LastName', '')}".strip(),
        "email": student.get("email", ""),
        "department": student.get("major", "Computer Science"),
        "year": calculate_year(student.get("graduationYear", "2025")),
        "cgpa": student.get("cgpa", "0.0"),
        "phone": student.get("phone", "Not provided"),
        "address": student.get("address", "Not specified"),
        "skills": ", ".join(student.get("skills", [])),
        "bio": student.get("bio", "No bio available"),
        "status": student.get("status", "Active"),
        "enrollmentDate": student.get("enrollmentDate", "2021-09-01"),
        "expectedGraduation": student.get("graduationYear", "2025"),
        "placementStatus": student.get("placementStatus", "Not Started")
    }

def calculate_year(graduation_year):
    current_year = datetime.now().year
    # Assume graduation_year is a string like "2025" or "2025-2026"
    try:
        grad_year = int(graduation_year.split("-")[0])
    except Exception:
        grad_year = current_year
    return f"{grad_year - current_year}th" if grad_year > current_year else "Graduated"

def generate_enrollment_date(graduation_year):
    try:
        start_year = int(graduation_year) - 4
    except Exception:
        start_year = datetime.now().year - 4
    return f"{start_year}-09-01"

# -----------------------------------------------
# Home Endpoint
@app.route('/')
def home():
    return "Campus Placement System API"

# -----------------------------------------------
# Authentication Endpoints
@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['Fullname', 'email', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate role
        if data['role'] not in ['admin', 'student']:
            return jsonify({"error": "Invalid role specified"}), 400

        # Check for existing user
        if users_collection.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already registered"}), 409

        # Hash password
        hashed_pw = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

        # Create user document with role
        user_data = {
            "Fullname": data["Fullname"],
            "email": data["email"],
            "password": hashed_pw,
            "role": data["role"]
        }

        result = users_collection.insert_one(user_data)

        return jsonify({
            "message": "Registration successful",
            "user": {
                "id": str(result.inserted_id),
                "email": data["email"],
                "Fullname": data["Fullname"],
                "role": data["role"]
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        required_fields = ['email', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        user = users_collection.find_one({"email": data["email"]})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not bcrypt.check_password_hash(user['password'], data['password']):
            return jsonify({"error": "Invalid email or password"}), 401

        if user['role'] != data['role']:
            return jsonify({"error": "Invalid role for this account"}), 403

        user_data = {
            "id": str(user['_id']),
            "email": user['email'],
            "Fullname": user['Fullname'],
            "role": user['role']
        }

        return jsonify({
            "message": "Login successful",
            "user": user_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------
# Student Endpoints (CRUD)
@app.route('/students', methods=['GET'])
def get_students():
    students = list(student_collection.find())
    mapped_students = [map_student(s) for s in students]
    return json_util.dumps(mapped_students)

@app.route('/students/<id>', methods=['GET'])
def get_student(id):
    student = student_collection.find_one({"_id": ObjectId(id)})
    if student:
        return json_util.dumps(map_student(student))
    return jsonify({"error": "Student not found"}), 404

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    names = data.get('name', '').split()
    db_student = {
        "firstName": names[0] if len(names) > 0 else "",
        "LastName": " ".join(names[1:]) if len(names) > 1 else "",
        "email": data.get('email', ''),
        "major": data.get('department', 'Computer Science'),
        "graduationYear": data.get('expectedGraduation', '2025'),
        "cgpa": data.get('cgpa', '0.0'),
        "phone": data.get('phone', ''),
        "address": data.get('address', ''),
        "skills": [s.strip() for s in data.get('skills', '').split(',')],
        "bio": data.get('bio', ''),
        "status": data.get('status', 'Active'),
        "enrollmentDate": data.get('enrollmentDate', generate_enrollment_date(data.get('expectedGraduation', '2025'))),
        "placementStatus": data.get('placementStatus', 'Not Started')
    }
    result = student_collection.insert_one(db_student)
    return jsonify({"id": str(result.inserted_id)}), 201

@app.route('/students/<id>', methods=['PUT'])
def update_student(id):
    data = request.json
    update_data = {
        "firstName": data.get('name', '').split()[0],
        "LastName": " ".join(data.get('name', '').split()[1:]),
        "email": data.get('email', ''),
        "major": data.get('department', 'Computer Science'),
        "graduationYear": data.get('expectedGraduation', '2025'),
        "cgpa": data.get('cgpa', '0.0'),
        "phone": data.get('phone', ''),
        "address": data.get('address', ''),
        "skills": [s.strip() for s in data.get('skills', '').split(',')],
        "bio": data.get('bio', ''),
        "status": data.get('status', 'Active'),
        "enrollmentDate": data.get('enrollmentDate', generate_enrollment_date(data.get('expectedGraduation', '2025'))),
        "placementStatus": data.get('placementStatus', 'Not Started')
    }
    result = student_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.modified_count:
        return jsonify({"success": True})
    return jsonify({"error": "Update failed"}), 400

@app.route('/students/<id>', methods=['DELETE'])
def delete_student(id):
    result = student_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"success": True})
    return jsonify({"error": "Student not found"}), 404

# -----------------------------------------------
# Placement Data Endpoint (for Placement_data collection)
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
    student_collection.update_one({"email": data["email"]}, {"$set": data}, upsert=True)
    return jsonify({"message": "Profile saved successfully!"}), 200

# -----------------------------------------------
# Gemini AI Integration for Skill Recommendations
def get_skill_recommendations(major, skills):
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
    student = student_collection.find_one({"email": email}, {"_id": 0})
    if student:
        major = student.get("major", "Unknown Major")
        skills = student.get("skills", [])
        recommended_skills = get_skill_recommendations(major, skills)
        student["recommended_skills"] = recommended_skills
        return jsonify(student), 200
    return jsonify({"error": "Profile not found"}), 404

# -----------------------------------------------
# Merged Placement Endpoints
@app.route('/api/branches/total', methods=['GET'])
def get_total_placed_students():
    try:
        branches = list(placement_stat_collection.find({}))
        total_placed = 0
        for branch in branches:
            value = branch.get('placedStudents', 0)
            if isinstance(value, dict) and '$numberInt' in value:
                value = int(value['$numberInt'])
            elif isinstance(value, str):
                value = int(value)
            else:
                value = int(value)
            total_placed += value
        return jsonify({"totalPlacedStudents": total_placed}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/branch/<branch_name>', methods=['GET'])
def get_branch_data(branch_name):
    try:
        branch = placement_stat_collection.find_one({"branch": branch_name})
        if not branch:
            return jsonify({"error": "Branch not found"}), 404
        branch['_id'] = str(branch['_id'])
        return jsonify(branch)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/placements', methods=['GET'])
def get_placed_students():
    placements = list(placement_stat_collection.find({}, {"_id": 0, "branch": 1, "placedStudents": 1}))
    return json_util.dumps(placements), 200, {'Content-Type': 'application/json'}

@app.route('/branch-stats/<branch>', methods=['GET'])
def get_branch_stats(branch):
    result = placement_stat_collection.find_one(
        {"branch": branch},
        {"_id": 0, "companiesCount": 1, "averageSalary": 1}
    )
    if result:
        return jsonify(result), 200
    return jsonify({"error": "Branch not found"}), 404

@app.route('/api/placement-past/<branch_name>', methods=['GET'])
def get_placement_past_by_branch(branch_name):
    try:
        placement_past_collection = db['Placement_past']
        data = list(placement_past_collection.find(
            {"branch": branch_name},
            {"academicYear": 1, "placedStudents": 1, "_id": 0}
        ))
        if not data:
            return jsonify({"error": f"No data found for branch: {branch_name}"}), 404
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/student-stats/pie/<branch>')
def get_student_stats(branch):
    # Fetch the specific document from the collection based on the branch
    document = placement_stat_collection.find_one({
        "branch": branch
    })

    if document:
        # Extract the required fields
        total_students = document.get('totalStudents', 0)
        placed_students = document.get('placedStudents', 0)

        # Create the response JSON
        response = {
            "branch": branch,
            "totalStudents": total_students,
            "placedStudents": placed_students
        }

        # Return the response as JSON
        return jsonify(response)
    else:
        # Return an error message if the document is not found
        return jsonify({"error": f"No data found for branch: {branch}"}), 404

# --------------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
