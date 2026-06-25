# GBA+ Census Tool

A bilingual (EN/FR) GBA+ document synthesis tool and survey-instrument testing
twin, grounded in real Statistics Canada / CRTC / Canadian Heritage data and
government GBA+ guidance.

This package is the **standalone, deployable** version of the tool. It's
structurally identical to the Claude.ai artifact, with one necessary change:
the three AI-calling features (document synthesis, plain-language rewrite,
briefing-note polish) now call a small backend proxy (`/api/messages`)
instead of `api.anthropic.com` directly, because outside Claude.ai there's no
built-in proxy to keep your API key off the browser.

```
gba-census-tool/
├── render.yaml          # Render deployment manifest
├── frontend/            # Vite + React app (the tool itself)
│   └── src/App.jsx      # Same component as the Claude.ai artifact
└── backend/             # FastAPI — serves the built frontend + proxies Anthropic calls
    └── main.py
```

## Why a backend is needed at all

Every "AI-powered" button in this tool calls the Anthropic Messages API.
That call needs a secret API key. A key embedded in frontend JavaScript is
visible to anyone who opens dev tools — so the backend's only real job is to
hold that key server-side and forward requests on the frontend's behalf.
Everything else (the checklist, simulation, population data, plain-language
scoring, exclusion estimator) is plain client-side logic with no backend
dependency at all.

## Deploy to Render (recommended — matches `render.yaml`)

1. Push this folder to a GitHub repo.
2. In the Render dashboard: **New → Blueprint**, point it at the repo. Render
   reads `render.yaml` automatically and creates one web service.
3. When prompted (or under the service's **Environment** tab), set:
   - `ANTHROPIC_API_KEY` = your real key (starts `sk-ant-...`). Get one at
     [console.anthropic.com](https://console.anthropic.com).
4. Deploy. Render runs the build command (`npm install && npm run build` for
   the frontend, `pip install -r requirements.txt` for the backend), then
   starts `uvicorn`, which serves the built frontend **and** the `/api/messages`
   proxy from the same service — no CORS configuration needed.
5. Your tool is live at the `.onrender.com` URL Render gives you.

The free Render plan works for this — it's a low-traffic internal tool, not a
high-volume public service. If you outgrow it, bump `plan:` in `render.yaml`.

## Run locally first (recommended before deploying)

Two terminals:

```bash
# Terminal 1 — backend
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...        # your real key
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend (dev server, hot reload)
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The Vite dev
server proxies `/api/*` to `localhost:8000` (see `vite.config.js`), so the
app behaves exactly like production without a build step each time you
change something.

To test the **production build** locally (closer to what Render runs):

```bash
cd frontend && npm run build && cd ..
cd backend && uvicorn main:app --port 8000
```

Then open `http://localhost:8000` directly — FastAPI is now serving the
built frontend itself.

## Deploying elsewhere (Vercel, Railway, Fly.io, your own VM)

Any host that can run a Python web service works the same way: build the
frontend, run the FastAPI app, set `ANTHROPIC_API_KEY` as an environment
variable. If your host doesn't support a single combined service, you can
split it into two: a static host for `frontend/dist`, and a separate small
API service for `backend/`. In that case update `vite.config.js`'s proxy and
the frontend's `fetch("/api/messages")` calls to point at the API service's
full URL instead of a relative path.

## What's *not* included

- **No database, no persistent storage.** The Library tab is a static
  reference list (sources/recommendations by GBA+ step) — there's nothing to
  persist. If you later want to save/compare survey snapshots again, that
  needs a small datastore (e.g., Render's managed Postgres, or even a JSON
  file) added back into the backend.
- **No authentication.** Anyone with the URL can use it, including the AI
  features (which cost you API credits per use). If this matters, add basic
  auth or an allowlist at the FastAPI level before sharing the link widely.
- **No automated tests in this package.** The component was tested
  extensively via headless React rendering during development; nothing
  carries forward into the repo automatically. Consider adding a smoke test
  (e.g., Playwright) if this becomes a maintained project.
