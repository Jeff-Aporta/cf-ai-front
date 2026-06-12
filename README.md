<p align="center">
  <img src="https://api.iconify.design/mdi/cloud-sync-outline.svg?color=%231565c0&width=96&height=96" width="96" height="96" alt="CF-AI" />
</p>

<h1 align="center">cf-ai-front</h1>

<p align="center"><strong>CF-AI</strong> — panel de pruebas para Cloudflare Workers AI (texto, audio, imagen y prompt).</p>

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=githubpages&logoColor=white)](https://jeff-aporta.github.io/cf-ai-front/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Cloudflare Workers AI](https://img.shields.io/badge/API-Workers%20AI-F38020?logo=cloudflare&logoColor=white)](https://github.com/Jeff-Aporta/cf-ai-back)
[![Orquestador](https://img.shields.io/badge/Gateway-main--orchestrator-5c6bc0?logo=cloudflare&logoColor=white)](https://main-orchestrator.jeffaporta.workers.dev/api/ui)

## Demo

**https://jeff-aporta.github.io/cf-ai-front/**

API vía orquestador: `https://main-orchestrator.jeffaporta.workers.dev/api/cf-ai/*`

## Uso local

Sirve la carpeta con Live Server (p. ej. `:5500`) e inicia sesión con las mismas credenciales que el resto del ecosistema ISA.

## Pestañas

| Pestaña | Endpoint |
|---------|----------|
| Hola mundo | `GET/POST /api/cf-ai/hello` |
| Prompt | `POST /api/cf-ai/tools/prompt/complete` |
| Chat | `POST /api/cf-ai/tools/text/responses` |
| Embeddings | `POST /api/cf-ai/tools/text/embeddings` |
| Catálogo | `GET /api/cf-ai/tools`, `/catalog` |

## Repo relacionado

| Rol | Repo |
|-----|------|
| Backend (privado) | [cf-ai-back](https://github.com/Jeff-Aporta/cf-ai-back) |
| Gateway | [main-orchestrator-back](https://github.com/Jeff-Aporta/main-orchestrator-back) |

MIT · Jeff-Aporta
