# Page Fault Analyzer

A responsive educational web application for Operating Systems concepts.

## Features
- Page Fault, Page Hit, Fault Rate, Success Rate calculations
- FIFO, LRU, Optimal, and MFU page replacement algorithms
- Simulation table visualization for all computed steps
- Comparison table for selected algorithms
- Dark/light theme toggle
- Export results as PDF
- Full-page blue glow background overlay
- Python Flask backend for algorithm calculation

## Setup
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```
4. Start the frontend app:
   ```bash
   cd frontend
   npm run dev
   ```

The frontend runs on `http://localhost:5173` and calls the backend API at `http://localhost:5000`.

## Backend
- `backend/app.py` — Flask API server
- `backend/algorithms.py` — page replacement logic and result generation

## Frontend
- `frontend/src/App.jsx` — main React application and input controls
- `frontend/src/components` — reusable UI modules such as `AlgorithmPanel`, `ComparisonTable`, and `ThemeToggle`
- `frontend/src/index.css` — Tailwind and custom styles for the app theme
