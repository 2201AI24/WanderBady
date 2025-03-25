# 🌍 AI Smart Travel Assistant - Technical Documentation

## 📌 Problem Statement
Planning travel can be overwhelming, requiring extensive research across multiple platforms. Our AI-powered **Smart Travel Assistant** simplifies this by generating **personalized itineraries, AI-powered travel recommendations, and insights** using **Azure OpenAI GPT-4**.

---

## 💡 Solution Overview
The **AI Smart Travel Assistant** allows users to:
- **Generate Custom Itineraries** based on preferences (budget, group size, activities, etc.).
- **Chat with an AI Assistant** for real-time travel recommendations.
- **Retrieve AI-Generated Travel Insights** about destinations (top attractions, hotels, travel tips).
- **Interact Using Voice Commands** instead of typing.

---

## 🔧 System Architecture
```
User ➝ Frontend (HTML, CSS, JS) ➝ Flask Backend ➝ Azure OpenAI GPT-4 API ➝ AI Response ➝ Display on UI
```

### 🔗 Key Components
- **Frontend:** User interface (HTML, CSS, JS) for interaction.
- **Backend:** Flask API to handle requests and responses.
- **Azure AI:** GPT-4 for chatbot, itinerary generation, and travel insights.
- **Azure Blob Storage:** Manages user-generated content (optional feature).

---

## ⚙️ API Endpoints
### 1️⃣ AI Chatbot
**Endpoint:** `/chat`
- **Method:** `POST`
- **Request Body:**
  ```json
  { "message": "Best places to visit in Paris?" }
  ```
- **Response:**
  ```json
  { "response": "Visit the Eiffel Tower, Louvre Museum..." }
  ```

### 2️⃣ Generate Travel Plan
**Endpoint:** `/plan-trip`
- **Method:** `POST`
- **Request Body:**
  ```json
  { "destination": "Paris", "date": "2025-04-10", "days": 5, "budget": "medium", "group": "family" }
  ```
- **Response:**
  ```json
  { "itinerary": "Day 1: Visit Eiffel Tower..." }
  ```

### 3️⃣ Fetch Travel Insights
**Endpoint:** `/travel-insights`
- **Method:** `POST`
- **Request Body:**
  ```json
  { "destination": "Paris" }
  ```
- **Response:**
  ```json
  { "travel_info": "Paris is known for its museums..." }
  ```

---

## 🛠️ Testing & Debugging
### ✅ **Tools Used**
- **Postman:** To test API responses.
- **Flask Debug Mode:** Enabled for error tracking.
- **Console Logs:** Debugging JavaScript functionality.

### ✅ **Common Issues & Fixes**
| Issue | Possible Cause | Fix |
|--------|--------------|-----|
| API not responding | Incorrect API key | Verify API key in `app.py` |
| UI not updating | LocalStorage issue | Clear browser cache |
| Speech recognition fails | Browser incompatibility | Use **Chrome** or **Edge** |

---

## 🏆 Hackathon Submission Checklist
✅ **GitHub Repository** with Code & Documentation  
✅ **5-Minute Pitch Video** (Upload & Submit the Link)  
✅ **Technical Documentation** (This file)  
✅ **Hackathon Submission Form** Completed  

---

🚀 **Let’s revolutionize travel with AI!** 🌎
