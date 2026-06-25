"""
GBA+ Census Tool — backend

Two jobs only:
1. Proxy POST /api/messages to the real Anthropic API, attaching the secret
   x-api-key server-side so it's never exposed to the browser.
2. Serve the built React frontend (frontend/dist) as static files.

Run locally:
    pip install -r requirements.txt
    export ANTHROPIC_API_KEY=sk-ant-...
    uvicorn main:app --reload --port 8000

In production (Render), ANTHROPIC_API_KEY is set as a secret environment
variable in the dashboard — see render.yaml.
"""

import os
from pathlib import Path

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

app = FastAPI(title="GBA+ Census Tool API")


@app.post("/api/messages")
async def proxy_messages(request: Request):
    """Forward the request body to Anthropic, injecting the API key.

    The frontend sends exactly the same JSON body it would send directly to
    api.anthropic.com (model, max_tokens, system, messages, ...) — this
    endpoint just adds the header that must never live in browser code.
    """
    if not ANTHROPIC_API_KEY:
        return Response(
            content='{"error":{"message":"Server is not configured with ANTHROPIC_API_KEY."}}',
            status_code=500,
            media_type="application/json",
        )

    body = await request.body()

    async with httpx.AsyncClient(timeout=60.0) as client:
        upstream = await client.post(
            ANTHROPIC_URL,
            content=body,
            headers={
                "content-type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": ANTHROPIC_VERSION,
            },
        )

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type=upstream.headers.get("content-type", "application/json"),
    )


# ---- Serve the built frontend (frontend/dist) ----
# Render's build command runs `npm run build` inside frontend/ first, which
# produces frontend/dist. This mount makes the FastAPI service also act as
# the static file host, so the whole app is one Render web service.
DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"
if DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="static")
