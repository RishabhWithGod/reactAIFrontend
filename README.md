# ElectricAI Analyzer Frontend

Professional React frontend for an AI-powered electrical drawing analyzer.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- shadcn-style component setup (`components.json` included)
- Axios
- React Router DOM
- Framer Motion

## Features

- Drag-and-drop PDF upload
- Upload progress UI
- Live analysis status timeline
- Drawing preview panel
- AI detected component cards
- Quantity counter table
- BOQ / material table
- JSON export
- Excel export with backend download fallback to client-side generation
- Previous analysis history
- Dark glassmorphism SaaS dashboard

## Project Structure

```text
src/
├── api/
├── components/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
└── utils/
```

## Environment

Copy `.env.example` to `.env` if needed:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_MODE=auto
```

Modes:

- `auto`: tries the requested async pipeline endpoints first, then falls back to the current backend's `/api/upload`
- `pipeline`: only uses `/upload-drawing`, `/analyze-drawing/:id`, `/drawing-result/:id`, `/history`, `/download-excel/:id`
- `legacy`: uses the current backend's `/api/upload` response contract

## Backend Compatibility

This frontend is ready for the target FastAPI contract:

- `POST /upload-drawing`
- `POST /analyze-drawing/{drawing_id}`
- `GET /drawing-result/{drawing_id}`
- `GET /history`
- `GET /download-excel/{drawing_id}`

It also supports the current backend in this repository today:

- `GET /api/health`
- `POST /api/upload`

## Development

Use Node 20+.

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Verification

Verified with:

- `npm run build`
- `npm run lint`
