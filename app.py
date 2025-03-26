from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Azure AI API Details
AZURE_GPT_API_URL = "https://ai-aihackthonhub282549186415.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview"
AZURE_API_KEY = os.getenv("AZURE_API_KEY")

@app.route("/")
def home():
    return "Welcome to the AI Smart Travel Assistant API!", 200

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message")
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        payload = {
            "messages": [{"role": "user", "content": user_message}],
            "model": "gpt-4",
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AZURE_API_KEY}"
        }
        
        response = requests.post(AZURE_GPT_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        ai_response = response_data.get("choices", [{}])[0].get("message", {}).get("content", "Sorry, I couldn't process that.")
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/plan-trip", methods=["POST"])
def plan_trip():
    try:
        data = request.json
        destination = data.get("destination")
        date = data.get("date")
        days = data.get("days")
        budget = data.get("budget")
        group = data.get("group")
        activities = data.get("activities", [])
        
        if not destination or not date or not days or not budget or not group:
            return jsonify({"error": "Missing required fields"}), 400
        
        trip_plan = f"""
        Here is your AI-generated itinerary for {destination} from {date} for {days} days.
        💰 Budget: {budget.capitalize()}
        🧑‍🤝‍🧑 Traveling with: {group.capitalize()}
        📍 Activities: {', '.join(activities) if activities else 'General sightseeing'}
        🌦 Weather Forecast: Sunny and 25°C (Sample Data)
        ✈ Flights: Sample flight details
        🏨 Recommended Hotels: Sample hotel recommendations
        """
        return jsonify({"itinerary": trip_plan})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/travel-insights", methods=["POST"])
def travel_insights():
    try:
        data = request.json
        destination = data.get("destination")
        
        if not destination:
            return jsonify({"error": "Destination is required"}), 400
        
        prompt = f"Give me a detailed travel guide for {destination}, including top attractions, best hotels, local travel tips, and must-try food."
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "model": "gpt-4",
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AZURE_API_KEY}"
        }
        
        response = requests.post(AZURE_GPT_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        travel_info = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No insights available.")
        return jsonify({"travel_info": travel_info})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
