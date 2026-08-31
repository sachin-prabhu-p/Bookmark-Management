# Bookmark Manager

A full-stack web app to save, organize, and categorize bookmarks — built with **Node.js**, **Express**, **MongoDB**, and vanilla JavaScript using the **Fetch API** for real-time frontend updates.

## Features
- Add, edit, delete, and search bookmarks
- Organize bookmarks by category
- Mark bookmarks as favorites
- RESTful API (CRUD) backed by MongoDB
- Responsive, dependency-free frontend

## Project Structure
```
bookmark-manager/
├── backend/
│   ├── models/
│   │   └── Bookmark.js       # Mongoose schema
│   ├── routes/
│   │   └── bookmarks.js      # CRUD API routes
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js              # Fetch API calls to the backend
```

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and set your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/bookmark_manager
   ```
   You can use a local MongoDB instance or a free MongoDB Atlas cluster.

3. **Run the server**
   ```bash
   npm start
   ```
   Or with auto-reload during development:
   ```bash
   npm run dev
   ```

4. **Open the app**
   Visit `http://localhost:5000` in your browser. The Express server serves the frontend directly, so no separate frontend server is needed.

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|---------------------------|
| GET    | /api/bookmarks         | Get all bookmarks (supports `?search=` and `?category=`) |
| GET    | /api/bookmarks/:id     | Get a single bookmark    |
| POST   | /api/bookmarks         | Create a new bookmark    |
| PUT    | /api/bookmarks/:id     | Update a bookmark        |
| DELETE | /api/bookmarks/:id     | Delete a bookmark        |

## Notes
- Update your resume bullet points to reference this repo (e.g. link to GitHub) once you push it.
- Consider deploying the backend on Render/Railway and the MongoDB database on Atlas for a live demo link.
