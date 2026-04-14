# Smart Stadium Experience System

##  Overview
Smart Stadium Experience System is an intelligent digital assistant designed to enhance the experience of attendees at large-scale sporting venues. It improves crowd movement, reduces waiting times, and provides real-time navigation and alerts.

---

##  Chosen Vertical
This project focuses on the **Smart Venue / Event Experience** vertical, targeting stadium attendees and administrators.

---

## Approach and Logic
The system uses rule-based intelligent decision-making with simulated real-time data:

- If crowd density is high → suggest alternate routes  
- If queue time is long → recommend nearby stalls  
- If emergency occurs → guide users to safe exits  

Firebase is used for real-time updates and Google Maps API for navigation.

---

##  Features
- AI-based crowd monitoring (simulated data)  
- Smart navigation with less crowded routes  
- Real-time queue management  
- Digital alerts and notifications  
- Admin dashboard for crowd monitoring  

---

##  Tech Stack
- React + Vite  
- Firebase (Realtime Database & Hosting)  
- Google Maps API  
- Google Cloud Run (Deployment)  

---

##  Live Demo
https://stadium-ai-assistant-455356131916.us-central1.run.app/

---

##  How It Works
1. User opens the app inside the stadium  
2. System fetches simulated crowd and queue data  
3. Provides optimized routes and suggestions  
4. Sends real-time alerts and updates  
5. Admin monitors and manages crowd through dashboard  

---

##  Assumptions
- Data is simulated (no real sensors used)  
- Users have internet access  
- Google Maps approximates indoor navigation  
- Prototype designed for demonstration  

---

##  Project Setup
```bash
npm install
npm run dev

## Deployment

This application is deployed using Google Cloud Run with a Docker container and Nginx server for serving the production build.

## Google Services Used
Firebase (Realtime Database, Authentication)
Google Maps API (Navigation and routing)
Google Cloud Run (Deployment and hosting)

## Author
Meghana Anupoju
anupojumeghana9305@gmail.com

