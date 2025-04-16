# Lifeline Angel

_An AI-powered first-aid recommendation system for real-time emergency response using text and image inputs._

> Helping users act fast and smart during medical emergencies — Powered by machine learning.

## Overview

**Lifeline Angel** is an intelligent first-aid recommendation system designed to provide **real-time assistance** during medical emergencies. By leveraging **machine learning** models for both image and text input, it can identify symptoms and suggest appropriate first-aid steps. Whether you're facing a burn, cut, sting, or sprain — Lifeline Angel empowers you to act quickly, safely, and with confidence.

## Why This Project?

In many emergency situations, people don’t know how to respond — time is critical, and proper guidance can save lives. Existing solutions are either too generic or inaccessible when you need them most.

**Lifeline Angel** was built to bridge that gap by:

- Providing instant, accurate first-aid recommendations using AI
- Supporting image and text-based symptom recognition
- Integrating with emergency services for critical escalation
- Prioritizing accessibility and ease-of-use in a secure interface

Our philosophy: **Empower everyone to provide or seek the right care, fast.**

## Features

- AI-powered symptom recognition (text & image inputs)
- Real-time first-aid recommendations
- Integration with emergency services
- Intuitive and responsive web interface
- Privacy-respecting and secure

## Roadmap

- [x] Phase 1: MVP with symptom detection via ML models
- [x] Phase 2: Web app with FastAPI backend and React frontend
- [ ] Phase 3: Add voice input and accessibility enhancements
- [ ] Phase 4: Mobile app with offline capabilities
- [ ] Phase 5: Community and peer-reviewed aid suggestions

## Tech Stack

**Frontend:**
TypeScript · React.js · Tailwind CSS

**Backend:**
Python · FastAPI

**Machine Learning:**
TensorFlow · OpenCV

**Database:**
MongoDB

**Deployment:**
Vercel (Frontend) · Render (Backend)

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+
- Git
- MongoDB Atlas account
- Render / Vercel account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lifeline-angel.git
cd lifeline-angel

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

Create a `.env` file in the backend and frontend directories.

### Frontend `.env`

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend `.env`

```
MONGO_URI=mongodb+srv://<your-db-connection-string>
SECRET_KEY=your-secret-key
```

## Usage

```bash
# Run frontend
npm run dev

# Run backend
uvicorn main:app --reload
```

- Upload an image or enter a symptom via the web interface.
- Receive real-time recommendations based on AI predictions.
- Optionally escalate to emergency services.

## Architecture

```
[Frontend (React.js + Tailwind CSS)]
          |
    [Backend API (FastAPI)]
          |
    [ML Models (TensorFlow, OpenCV)]
          |
     [Database (MongoDB)]
```

## Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com)
- **Backend:** Deployed on [Render](https://render.com)

## Contributing

We welcome contributions! Here's how:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Push to GitHub: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

- Inspired by the need for **real-time, accessible first aid**
- Built by The Lifeline Angel Team
- Powered by TensorFlow, FastAPI, and modern web tech
