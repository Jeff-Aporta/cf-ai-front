# cf-ai-front

Panel de pruebas para **Cloudflare Workers AI** (`cf-ai`).

- GitHub Pages: `https://jeff-aporta.github.io/cf-ai-front/`
- API vía orquestador: `https://main-orchestrator.jeffaporta.workers.dev/api/cf-ai/*`

## Uso local

Sirve la carpeta con Live Server (p. ej. `:5500`) e inicia sesión con las mismas credenciales que el resto del ecosistema.

## Pestañas

| Pestaña | Endpoint |
|---------|----------|
| Hola mundo | `GET/POST /api/cf-ai/hello` |
| Prompt | `POST /api/cf-ai/tools/prompt/complete` |
| Chat | `POST /api/cf-ai/tools/text/responses` |
| Embeddings | `POST /api/cf-ai/tools/text/embeddings` |
| Catálogo | `GET /api/cf-ai/tools`, `/catalog` |
