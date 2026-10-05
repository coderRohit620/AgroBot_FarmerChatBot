# 🌾 AI-AgroBot Pro (v2.0)
### *Next-Generation Intelligent Agronomist & Farmer Advisory Assistant*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.2+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📖 Overview

**AI-AgroBot Pro** is a comprehensive, production-ready agricultural advisory platform built to empower farmers with immediate, data-driven farming insights. Combining an **offline-first multilingual Knowledge Base** with **OpenAI GPT fallback** and **computer-vision-based plant health diagnosis**, AgroBot assists farmers across crop lifecycle management, pest & disease identification, soil preparation, irrigation schedules, and weather resilience.

The application features a responsive, dark-mode glassmorphic user interface tailored for both desktop and mobile devices, complete with **voice-to-text recognition** for hands-free field usage.

---

## ✨ Key Features

### 🤖 1. Hybrid Dual-Engine Chatbot
* **Instant Offline Knowledge Base**: Matches questions against curated agricultural domain datasets in milliseconds without requiring third-party API quotas.
* **LLM Fallback (OpenAI GPT-4o-mini)**: Seamlessly answers complex or open-ended farming inquiries when the query is beyond the local knowledge base.
* **Trilingual Multilingual Support**: Fully localized answers and queries in **English (`en`)**, **Hindi (`hi`)**, and **Tamil (`ta`)**, powered by automatic language detection (`langdetect`) and real-time translation (`googletrans`).
* **Interactive Quick Tips**: Pre-configured quick-prompt suggestions for instant answers regarding pest control, soil types, irrigation, and fertilizers.

### 🌿 2. Computer Vision Crop Health Analyzer
* **Image Upload & Diagnosis**: Upload plant or leaf photos directly into the chat stream (`PNG`, `JPG`, `JPEG`, `GIF`, `WebP`).
* **Chromatic Vegetative Analysis**: Evaluates healthy vegetative coverage (green spectrum), dry soil/decay (brown spectrum), and stress/chlorosis (yellow spectrum) using Pillow (PIL).
* **Automated Stress Alerts**: Categorizes plant health into `HEALTHY`, `MODERATE`, or `STRESSED`, providing actionable remedial recommendations.

### 🎙️ 3. Hands-Free Voice Input
* Integrated Web Speech API (`SpeechRecognition`) for voice querying in Indian agricultural accents and regional languages.

### 👤 4. Farmer Profiles & Chat History
* **Personalized Context**: Tracks each farmer's **Primary Crop**, **Farming Region / State**, and **Preferred Language**.
* **Audit Trail**: Saves message conversations and diagnostic image reports to the database under user sessions.

### ⚙️ 5. Comprehensive Admin Control Panel
* **Live System Metrics**: Monitor registered user count, total queries answered, and platform status in real time.
* **Knowledge Base JSON Editor**: Live in-browser editor to add, update, or tweak domain Q&A records on the fly.
* **Bulk CSV Knowledge Ingestion**: Upload custom agricultural dataset CSV files to expand the offline bot's vocabulary instantly.
* **Farmer Management**: View individual user profiles, examine past queries, and manage user accounts.
* **Data Privacy Controls**: One-click chat history truncation and cleanup.

### 🛡️ 6. Safety & Content Guardrails
* Built-in safety filter (`utils/safety.py`) prevents disallowed words, malicious queries, and sanitizes outgoing responses.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    A[Farmer / User Browser] -->|HTTP / WebSockets| B[Flask Application Server]
    A -->|Voice Input| A1[Web Speech API]
    A -->|Crop Leaf Photo| B1[/api/analyze-image]
    A -->|Chat Message| B2[/api/chat]
    
    subgraph Backend Services
        B1 --> C[Pillow Image Analysis Engine]
        B2 --> D{Safety & Moderation Filter}
        D -->|Pass| E[Language Detector langdetect]
        E --> F{Local Knowledge Base kb.json}
        F -->|Match Found| G[Translator googletrans]
        F -->|No Match| H[OpenAI GPT-4o-mini Fallback]
        H --> G
        G --> I[(SQLite / SQLAlchemy DB)]
    end
    
    subgraph Admin Portal
        J[Admin User] --> K[/admin Dashboard]
        K --> L[Edit kb.json / Upload CSV]
        K --> M[User & Chat Audit Management]
    end
```

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Framework** | [Flask 2.2+](https://flask.palletsprojects.com/), [Werkzeug](https://palletsprojects.com/p/werkzeug/) |
| **Authentication & ORM** | [Flask-Login](https://flask-login.readthedocs.io/), [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) |
| **Natural Language & AI** | [OpenAI API](https://openai.com/) (`gpt-4o-mini`), `langdetect`, `googletrans` |
| **Image Processing** | [Pillow (PIL)](https://python-pillow.org/) |
| **Database** | SQLite (`agrobot.db`) / Configurable via `DATABASE_URL` |
| **Frontend UI** | HTML5, Vanilla Modern CSS (Glassmorphism & Dark Mode), JavaScript (ES6+) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Repository Structure

```text
AgroBot_FarmerChatBot/
├── app.py                      # Core Flask application, routing, and APIs
├── chatbot_model.py            # Dual-mode AI reasoning, NLP & translation pipeline
├── database.py                 # SQLAlchemy schemas (User, ChatHistory) & DB initialization
├── kb.json                     # Primary multilingual agricultural knowledge base
├── kb_agriculture_master.csv   # Comprehensive master agricultural dataset
├── kb_full_professional.csv    # Extended professional agronomy Q&A records
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container build instructions
├── docker-compose.yml          # Container orchestration configuration
├── uploads/                    # Directory for user-submitted crop images
├── instance/                   # SQLite database storage (agrobot.db)
├── utils/
│   └── safety.py               # Content moderation, sanitization & forbidden terms
├── templates/
│   ├── base.html               # Master layout, navigation bar & footer
│   ├── index.html              # Main chat interface with quick tips & sidebar
│   ├── login.html              # Secure farmer & admin authentication
│   ├── register.html           # New user registration with crop/region metadata
│   ├── profile.html            # Farmer profile settings & language selector
│   ├── admin_dashboard.html    # Administrative control center & KB editor
│   └── admin_view_user.html    # Individual farmer chat audit view
└── static/
    ├── style.css               # Responsive design, theme variables & animations
    ├── script.js              # Client-side chat logic, voice input & photo uploads
    ├── bot.png                 # Platform branding & avatar
    └── favicon.ico             # Application favicon
```

---

## 🚀 Getting Started

### Prerequisites
* **Python 3.10+** (Python 3.11 recommended)
* **pip** (Python package installer)
* **Git**
* *(Optional)* Docker and Docker Compose

---

### Method 1: Local Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/coderRohit620/AgroBot_FarmerChatBot.git
   cd AgroBot_FarmerChatBot
   ```

2. **Create and activate a virtual environment:**
   * **On Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **On Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables (Optional):**
   You can export environment variables in your terminal or configure them via your deployment environment:
   ```bash
   # Optional: OpenAI API Key for GPT fallback
   export OPENAI_API_KEY="your-openai-api-key-here"

   # Optional custom secret key & admin credentials
   export FLASK_SECRET_KEY="your-secure-flask-secret-key"
   export ADMIN_EMAIL="admin@agrobot.com"
   export ADMIN_PASSWORD="YourSecurePassword123"
   ```
   *(On Windows PowerShell, use `$env:OPENAI_API_KEY="your-api-key"`)*

5. **Start the application:**
   ```bash
   python app.py
   ```

6. **Access the application:**
   Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

---

### Method 2: Running with Docker

Run the entire stack in an isolated container without needing local Python installations:

```bash
# Build and run container
docker-compose up --build
```

The application will start and listen at `http://localhost:5000`.

---

## 🔐 Default Credentials

Upon initial database creation, an administrator account is automatically generated:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@agrobot.com` | `Admin@123` | Full Access (Dashboard, KB Editor, User Management) |

> ⚠️ **Important**: Please change the default admin password after first deployment in production.

---

## 🔌 API Reference

### 1. Chat Completion Endpoint
* **Endpoint:** `POST /api/chat`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "message": "What is the best fertilizer for rice crop during flowering?"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "response": "Apply phosphorus and potassium fertilizers during flowering. Avoid excessive nitrogen..."
  }
  ```

---

### 2. Plant Health Image Analysis
* **Endpoint:** `POST /api/analyze-image`
* **Authentication:** Required (User must be logged in)
* **Content-Type:** `multipart/form-data`
* **Form Parameters:**
  * `image`: Binary file (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` - max 5MB)
  * `message` *(optional)*: Question or notes about the sample
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "response": "🌿 Image Analysis Results:\n• Health Status: MODERATE\n• Green Coverage: 42.5%...",
    "analysis": {
      "dimensions": "1024×768",
      "health_status": "MODERATE",
      "confidence": "medium",
      "color_analysis": {
        "green_percentage": 42.5,
        "brown_percentage": 28.1,
        "yellow_percentage": 29.4
      }
    }
  }
  ```

---

## 📊 Knowledge Base CSV Import Schema

To upload bulk agricultural knowledge through the Admin Dashboard (`/admin`), upload a CSV file with the following column structure:

| Column Name | Description | Example |
| :--- | :--- | :--- |
| `keywords` | Comma-separated query triggers | `aphids, wheat aphids, kill aphids` |
| `answer_en` | Advisory content in English | `Spray neem oil or dimethoate 30 EC at 1.5 ml/L.` |
| `answer_hi` | Advisory content in Hindi | `नीम का तेल या डाइमेथोएट 30 ईसी 1.5 मिली/लीटर का छिड़काव करें।` |
| `answer_ta` | Advisory content in Tamil | `வேப்ப எண்ணெய் அல்லது டைமெத்தோயேட் 30 EC தெளிக்கவும்.` |

---

## 🛡️ Security & Best Practices

1. **Authentication:** Passwords are encrypted using Werkzeug's `generate_password_hash` (PBKDF2/SHA256).
2. **File Upload Hardening:** User uploads are validated for file extensions, checked against a 5MB size limit, and sanitized with `secure_filename`.
3. **Session Safety:** Session cookies use Flask's signed cryptographic cookies.
4. **Data Isolation:** User chat logs are tied to specific foreign-keyed user records.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ to support sustainable farming communities.</sub>
</div>
