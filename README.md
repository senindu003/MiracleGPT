# ✨ MiracleGPT

> **Choose the path. Shape the story. Turn it into something worth keeping.**

MiracleGPT is a full-stack, AI-powered interactive story generator. Readers choose from a branching story wireframe, build their selected route into a longer story, save it to a personal library, and export it as a PDF.

Built with React, FastAPI, SQLAlchemy, and a DeepSeek-compatible chat-completions API.

## What it does

- **Creates branching stories** from your choices of genre, characters, story depth, tone, setting, audience, emoji use, and special requests.
- **Lets readers decide the route** through an episode-by-episode story wireframe.
- **Expands the selected route** into a longer, dialogue-rich story (targeted by the prompt at 2,000–3,000 words).
- **Provides account-based libraries**: sign up, sign in, save completed stories, open them later, and delete them.
- **Exports stories to PDF** in the browser with preview and download support.
- **Protects user actions with JWT authentication** and stores passwords as bcrypt hashes.

## Experience flow

```mermaid
flowchart LR
    A[Create an account] --> B[Set story preferences]
    B --> C[Generate an interactive wireframe]
    C --> D[Make choices]
    D --> E[Collect the chosen path]
    E --> F[Build up the full story]
    F --> G[Save to library or export PDF]
```

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Headless UI |
| PDF output | `@react-pdf/renderer` |
| Backend | FastAPI, Uvicorn, Pydantic |
| Data | SQLAlchemy with MySQL or PostgreSQL |
| Auth | JWT (`python-jose`) and bcrypt (`passlib`) |
| AI | OpenAI Python SDK configured for the DeepSeek API |
| Deployment | Docker and Railway configuration; Vercel SPA rewrite for the frontend |

## Project structure

```text
MiracleGPT/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── ai/                     # Prompt reference material
│   ├── db/                     # SQLAlchemy engine and models
│   └── routers/                # AI, authentication, and story endpoints
├── frontend/
│   ├── src/components/         # Sign-up, sign-in, and home screens
│   ├── src/subcomponents/      # Prompt form, episode viewer, PDF preview
│   └── src/api.js              # Client API calls
├── Dockerfile                  # Backend container image
└── railway.json                # Railway deployment settings
```

## Quick start

### Prerequisites

- Python 3.11+
- Node.js 20+ and npm
- A MySQL or PostgreSQL database
- A DeepSeek API key

### 1. Clone and configure

```bash
git clone <your-repository-url>
cd MiracleGPT
```

Create a `.env` file in the repository root:

```env
# Backend
DATABASE_URL=mysql+pymysql://USER:PASSWORD@localhost:3306/miraclegpt?charset=utf8mb4
SECRET_KEY=replace-with-a-long-random-secret
DEEPSEEK_API_KEY=your-deepseek-api-key
ORIGINS=http://localhost:5173

# Frontend (Vite exposes only variables beginning with VITE_)
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For PostgreSQL, use a standard URL such as:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/miraclegpt
```

The backend converts standard PostgreSQL URLs to SQLAlchemy's `psycopg2` dialect automatically.

> Keep `.env` private. Never commit API keys, JWT secrets, or database credentials.

### 2. Start the API

From the repository root:

```bash
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Install dependencies and run FastAPI:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The API starts at `http://127.0.0.1:8000`. Tables are created automatically when the app starts.

### 3. Start the web app

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## API overview

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | No | Health/welcome response |
| `POST` | `/signup` | No | Create an account |
| `POST` | `/login` | No | Sign in and receive a bearer token |
| `GET` | `/me` | Yes | Return the signed-in user's profile |
| `POST` | `/set_magic` | Yes | Generate a branching story wireframe |
| `POST` | `/enhance` | Yes | Expand selected wireframe text into a full story |
| `POST` | `/save` | Yes | Save a completed story to the library |
| `GET` | `/get_story/{story_id}` | Yes | Retrieve one of the user's saved stories |
| `DELETE` | `/delete_story/{story_id}` | Yes | Delete one of the user's saved stories |

### Generate a story

`POST /set_magic`

```json
{
  "theme": "Adventure",
  "mainCharacters": "3",
  "episodes": "3",
  "choicesPerEpisode": "2",
  "tone": "Lucid",
  "setting": "Tropical Island",
  "audience": "Teens (ages 13-18)",
  "emojis": "Use sparingly",
  "specialRequests": "Focus on friendship",
  "additionalInstructions": "Include a surprising but hopeful ending."
}
```

The service returns a JSON object of flat, linked episodes. Each non-final episode has choice text and a `leads_to` episode ID; final episodes have no choices.

## Docker

Build and run the backend container from the repository root:

```bash
docker build -t miraclegpt-api .
docker run --env-file .env -p 8000:8000 miraclegpt-api
```

The included `railway.json` is configured to build from the Dockerfile. Deploy the frontend separately (for example, on Vercel) and set `VITE_API_BASE_URL` to the public API URL. Add the deployed frontend URL to `ORIGINS` on the backend.

## Configuration notes

- `ORIGINS` accepts a comma-separated list, such as `http://localhost:5173,https://your-app.vercel.app`.
- The frontend reads `VITE_API_BASE_URL` at build time. Rebuild or redeploy it after changing the value.
- The AI client uses `deepseek-chat` through `https://api.deepseek.com`.
- Story generation has a configured per-user daily limit constant of `5`. If you rely on this limit in production, ensure the successful-generation counter is incremented and covered by tests.

## Security and production checklist

Before deploying publicly:

- [ ] Use strong, unique `SECRET_KEY`, database credentials, and API keys.
- [ ] Set an explicit production `DATABASE_URL`; do not rely on a local development fallback.
- [ ] Restrict `ORIGINS` to the exact domains that should access the API.
- [ ] Use HTTPS for the frontend and API.
- [ ] Add rate limiting, observability, migrations, and automated tests.
- [ ] Remove debug logging and confirm no credentials are present in source history.

## Available scripts

```bash
cd frontend
npm run dev      # Start Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## License

No license file is currently included in this repository. Add a license before granting reuse rights to others.

---

Made for stories that do not have to follow a single path. ✨
