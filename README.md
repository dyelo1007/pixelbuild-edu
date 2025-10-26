# 🎮 PixelBuild Edu  

<p align="center">
  <img src="https://raw.githubusercontent.com/dyelo1007/pixelbuild-edu/main/client/public/images/pixie.png](https://github.com/dyelo1007/pixelbuild-edu/blob/main/client/public/pixie.png" alt="Pixel Logo" width="150"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Built%20With-MERN-blue.svg" alt="Built with MERN">
  <img src="https://img.shields.io/badge/Deployed%20On-Render-purple.svg" alt="Deployed on Render">
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Project Status">
</p>

---

**PixelBuild Edu** is a modern, interactive educational platform designed to make learning PC building an engaging and hands-on experience.  
Built on the **MERN stack**, this application transforms a traditionally complex topic into a series of fun, game-like learning modules.

---

## 🎓 A Thesis Project

This application was developed as a **final thesis** for a Computer Science degree.  
It represents a comprehensive effort to design, build, and deploy a full-stack web application that solves a real-world educational challenge.

The project's initial concept was a **marketplace for PC parts**.  
However, based on valuable feedback from university panelists, the focus was pivoted to an **educational platform** to address the more fundamental problem of knowledge gaps in PC hardware compatibility.

---

## 🚀 Live Demo

A live version of the application is deployed on **Render**.  

👉 [**Visit PixelBuild Edu Live**](https://pixelbuild-edu.onrender.com)

---

## ✨ Key Features

The platform is divided into two main user roles:  
**Admin Panel** for content creation and **Student Dashboard** for learning.

### 👨‍💻 Admin Features
- **Dynamic Dashboard:** Overview of total students, quizzes, challenges, and recent activity.  
- **Content Management:** Full suite of tools to create and manage educational content.  
- **Quiz Management:** Full CRUD functionality for quizzes and questions.  
- **Challenge Hub:** Three-tiered system for Components → Puzzles → Challenges.  
- **Student Management:** Manage and edit student accounts.  
- **Mode Management:** Toggle specific learning modes (quiz, challenge, sandbox) for all students.

### 👩‍🎓 Student Features
- **Personalized Dashboard:** Displays upcoming tasks, scores, and activity.  
- **Challenge Mode:** Drag-and-drop puzzle game for hardware compatibility learning.  
- **Quiz Mode:** Timed quizzes with immediate feedback.  
- **Review Mode:** Create flashcards and study with auto-generated quizzes.  
- **Free Build Sandbox:** Experiment with all components and get instant compatibility feedback powered by a real-time JSON Rules Engine.

---

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, framer-motion, react-dnd  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JSON Web Tokens (JWT), bcrypt  
**Deployment:** Render  

---

## 🚧 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18.x or later)
- npm
- MongoDB Atlas account *(or local MongoDB instance)*

---

### 🔧 Installation

Clone the repository:
```bash 
git clone https://github.com/dyelo1007/pixelbuild-edu.git
cd pixelbuild-edu
```
Install Backend Dependencies:
```bash 
cd backend
npm install
```

Install Frontend Dependencies:
```bash 
cd ../client
npm install
```
Environment Variables
Create a .env file inside the backend directory and add:
```bash 
env

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
▶️ Running the Application
Start the backend server:
```
```bash 
cd backend
npm run dev
Server runs on: http://localhost:5000
```
Start the frontend client:

```bash 
Copy code
cd ../client
npm run dev
Client runs on: http://localhost:5173
```

🧑‍🏫 Project Structure
```csharp

pixelbuild-edu/
│
├── backend/          # Express.js + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── client/           # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   └── vite.config.ts
│
└── README.md
```
💡 Future Enhanc
ements
Leaderboards and achievements system

Progress tracking for each student

Enhanced challenge creation tools

Real-time multiplayer challenge mode

🧠 Authors
👨‍💻 Developed by: @dyelo1007, @whoisririi, @yoitskyannu 
🎓 Thesis Project — Computer Science Degree

📜 License
This project is licensed under the MIT License — you’re free to use, modify, and distribute it for any purpose, with attribution.
See the [LICENSE](./LICENSE) file for more details.





