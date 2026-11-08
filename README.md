# Kagoj Quick Notes (কাগজ)

A calm, mobile-first notepad web application crafted with React, Vite, and Tailwind CSS, backed by a Node.js + Express + MongoDB REST API. Built to feel like physical stationery—instant note capture, auto-save, tactile gestures, and bilingual support (English and বাংলা with the Hind Siliguri typeface).

## Key Features

- **Instant Notepad Feel**: No login or setup friction. Open and begin typing immediately.
- **Full-Stack Persistence**: Node.js, Express, and MongoDB backend with Mongoose.
- **Masonry Grid & List Switcher**: 2-column mobile card view or 1-column reading list.
- **Auto-Save & Manual Save**: ~800ms debounce with smooth "Saving… / Saved ✓" visual feedback.
- **Gentle Paper Palette**: 7 natural pastel paper colors (warm ivory, sage, peach, lilac, sky, butter, rose).
- **Pin to Top**: Keep critical thoughts anchored above other notes.
- **Instant Search**: Real-time filtering across titles and note bodies in both English and Bengali.
- **Touch-First Deletion**: Swipe left or long-press any card, or tap the trash icon in the editor. Confirmed via bottom sheet with a 5-second "Undo" toast.
- **Offline & PWA Ready**: Installable on iOS (Safari Add to Home Screen) and Android/Desktop with offline cache.

---

## Project Structure

```
kagoj-quick-notes/
├── client/                 # React frontend (Vite, Tailwind v4, Lucide)
│   ├── src/
│   │   ├── components/     # UI components (Editor, NoteGrid, SearchBar, etc.)
│   │   ├── hooks/          # React hooks (useNotes, useFilteredNotes, etc.)
│   │   ├── services/       # API layer (api.ts connects to backend)
│   │   └── types/          # TypeScript definitions
│   └── .env                # Client environment variables (VITE_API_URL, VITE_USE_MOCK_API)
├── server/                 # Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # Database connection (db.js)
│   │   ├── controllers/    # Note controller (CRUD operations)
│   │   ├── models/         # Mongoose Note model
│   │   ├── routes/         # Express router for /api/notes
│   │   └── server.js       # Express app setup and listen
│   └── .env                # Server environment variables (PORT, MONGODB_URI)
└── package.json            # Root workspace scripts
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v26)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 2. Configure Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kagoj_notes
CLIENT_URL=http://localhost:3000
```

**Client (`client/.env`):**
```env
VITE_API_URL="http://localhost:5000/api"
VITE_USE_MOCK_API="false"
```
*(Set `VITE_USE_MOCK_API="true"` if you ever want to preview the frontend offline with localStorage mock)*

### 3. Run the Backend Server

Open a terminal:
```bash
cd server
npm run dev
```
The server starts at `http://localhost:5000`.
- Health check: `http://localhost:5000/api/health`
- Notes endpoint: `http://localhost:5000/api/notes`

### 4. Run the Client

Open a second terminal:
```bash
cd client
npm run dev
```
The client runs at `http://localhost:3000`.

*(Or from the project root, you can run `npm run server` and `npm run client`)*

---

## API Documentation

| Method | Endpoint | Description | Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | None | `{ status: "ok", service: "..." }` |
| `GET` | `/api/notes` | Get all notes (pinned first) | None | Array of `Note` objects |
| `GET` | `/api/notes/:id` | Get single note by ID | None | `Note` object |
| `POST` | `/api/notes` | Create a new note | `{ title, content, color, pinned }` | Newly created `Note` object (201) |
| `PUT` | `/api/notes/:id` | Update note | `{ title?, content?, color?, pinned? }` | Updated `Note` object |
| `DELETE` | `/api/notes/:id` | Delete note | None | `{ success: true, id: ":id" }` |


---

## Deploying to Vercel

Both the frontend and backend are pre-configured with `vercel.json` files for zero-friction Vercel deployment.

### 1. Deploy the Backend (`server`)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... &rarr; Project**.
2. Import your GitHub repository.
3. In the project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kagoj_notes?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
5. Click **Deploy**.

#### Successful Deployment Confirmation
Once deployed, open your backend Vercel URL (e.g. `https://your-backend.vercel.app/`).
- **In your browser**: You will see a stationery-styled confirmation card showing **"✓ Deployment Successful"** and **"Database: Connected (kagoj_notes)"**.
- **Via API**: A JSON response confirming `status: "success"`, platform, and active endpoints.

---

### 2. Deploy the Frontend (`client`)

1. In your [Vercel Dashboard](https://vercel.com/dashboard), click **Add New... &rarr; Project**.
2. Import the same repository.
3. In the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Add the following **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend.vercel.app/api` *(use your deployed backend URL from step 1)*
   - `VITE_USE_MOCK_API`: `false`
5. Click **Deploy**.

Your frontend is now connected to your backend on Vercel with automatic CORS support and seamless client-side routing.
