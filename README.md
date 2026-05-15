# The AVOCADO HUB — Lead Gen Builder

A full-stack AI-powered tool that generates bespoke lead generation assets (quizzes, self-assessments, checklists, and audits) for charities, CICs, and social enterprises.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript
- **AI**: NVIDIA NIM (meta/llama-3.3-70b-instruct via OpenAI-compatible SDK)

---

## Setup

### 1. Clone & install dependencies

```bash
npm install
npm run install:all
```

### 2. Configure environment

Copy `.env.example` to `.env` in the project root and add your NVIDIA NIM API key:

```bash
cp .env.example .env
```

Then edit `.env`:

```
NVIDIA_API_KEY=nvapi-your-key-here
PORT=3001
```

Get a free API key at [build.nvidia.com](https://build.nvidia.com).

### 3. (Optional) Add your logo

Place `avocado-hub-logo.png` in `client/src/assets/` to use an image logo in the navbar. If absent, the app falls back to a text logo.

### 4. Run in development

```bash
npm run dev
```

Starts the Express API (port 3001) and Vite dev server (port 5173) concurrently.

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
/
├── client/                  # Vite + React frontend
│   ├── src/
│   │   ├── components/      # Navbar, StepOne–Three, ToolPreview, EditPanel, ExportPanel
│   │   ├── types/           # Shared TypeScript types
│   │   └── utils/           # API client, HTML export generator
│   └── index.html
├── server/
│   └── src/
│       └── server.ts        # Express API with NVIDIA NIM calls
├── .env                     # Your API key (never committed)
└── .env.example             # Template
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/recommend` | Analyses org details and returns best format + reason |
| `POST` | `/api/generate` | Generates complete lead gen tool JSON |
| `GET`  | `/api/health` | Health check |

---

## Building for Production

```bash
cd client && npm run build
cd server && npm run build
cd server && npm start
```

---

## Branding

| Token | Value |
|-------|-------|
| Dark Green | `#033220` |
| Light Green | `#257F00` |
| Cream | `#FFEFE6` |
| Body font | Barlow (400, 500, 600, 700) |
| Logo font | DM Serif Display |
