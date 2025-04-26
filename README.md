# 🗳️ Online Voting System

## 📌 Project Title
**Online Voting System using MERN Stack, Blockchain & Face Recognition**

## 💡 Project Idea & Description

This project aims to develop a secure and scalable **Online Voting System** that enables users to vote digitally in elections. It incorporates **Blockchain technology** to ensure votes are immutable and transparent, and uses **OpenCV-based face recognition** for verifying voter identity before casting a vote.

### User Roles:
- **Admin**: Can manage elections, candidates, and view results.
- **User/Voter**: Can register, log in, verify identity via face recognition, and vote once in an election.

### Key Features:
- **Face Recognition** using OpenCV for voter verification
- **Blockchain Integration** to store and validate votes securely and immutably
- JWT-based authentication stored in HTTP-only cookies
- Role-based access control (admin/user)
- One-person-one-vote enforcement
- Real-time vote counts
- Clean, responsive UI using React and Tailwind CSS
- RESTful API using Express.js and MongoDB

---

## 🧰 Tech Stack

### 👨‍💻 Frontend:
- **React.js** – For building the user interface
- **React Router** – For client-side routing
- **Axios** – For API requests
- **Tailwind CSS** – For styling
- **Vercel** – For frontend deployment

### 🧠 Backend:
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for Node.js
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **jsonwebtoken** – For handling JWT authentication
- **bcryptjs** – For password hashing
- **cookie-parser** – To parse HTTP-only cookies
- **Render** – For backend deployment

### 🔐 Security & Biometric:
- **Blockchain** – For storing votes securely and ensuring transparency and immutability
- **OpenCV (Python)** – For face detection and recognition to verify voter identity
- **dlib / face_recognition** – Python libraries for facial feature encoding

---

## 🗓️ 20-Day Capstone Plan

| Day | Task |
|-----|------|
| **Day 1** | Plan project structure and finalize tech stack (MERN + Blockchain + OpenCV). Initialize Git repo. |
| **Day 2** | Brainstorm user stories, features, and system flow. Begin Lo-Fi wireframe designs (paper/sketch). |
| **Day 3** | Finalize Low-Fidelity (Lo-Fi) wireframes for all main screens (login, register, vote, admin dashboard). |
| **Day 4** | Create Mid-Fidelity (Mid-Fi) designs using Figma or wireframing tools. |
| **Day 5** |  Work on High-Fidelity (Hi-Fi) designs: colors, fonts, responsiveness.  |
| **Day 6** |Set up backend with Express.js and connect MongoDB. Create folder structure for Python (face recognition) script. |
| **Day 7** | Add face registration (upload image) functionality for users. |
| **Day 8** | Implement authentication and role-based access (admin/user). |
| **Day 9** | Build OpenCV script for capturing and verifying face using uploaded image. |
| **Day 10** | Create API for elections and candidates (admin only). |
| **Day 11** | Add candidate CRUD and linking candidates to specific elections. |
| **Day 12** | Implement user registration and login with password hashing and JWT|
| **Day 13** | Set up Blockchain logic for vote recording and validation (simple local or testnet chain). |
| **Day 14** | Integrate face verification flow before allowing users to vote. |
| **Day 15** | Start frontend: implement Hi-Fi design layout using React + Tailwind. |
| **Day 16** | Build user-facing components: login, register, dashboard, face registration. |
| **Day 17** | Build admin dashboard: election and candidate management. |
| **Day 18** | Implement voting UI, connect to backend, and integrate Blockchain. |
| **Day 19** | Full testing: Face match accuracy, vote recording, edge cases, responsive design check. |
| **Day 20** | Final documentation, deploy frontend/backend, demo recording, GitHub cleanup, and presentation prep. |

---

## ✅ Final Deliverables
- Complete codebase (frontend + backend + face recognition)
- Blockchain vote recording demo
- Deployed live project links
- Figma/Wireframe Designs (Lo-Fi, Mid-Fi, Hi-Fi)
- Documentation & demo video
- GitHub repository link
