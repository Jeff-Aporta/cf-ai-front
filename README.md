<p align="center">
  <img src="https://api.iconify.design/mdi/cloud-sync-outline.svg?color=%231565c0&width=96&height=96" width="96" height="96" alt="CF-AI" />
</p>

<h1 align="center">cf-ai-front</h1>

<p align="center"><strong>CF-AI</strong> — panel de pruebas para Cloudflare Workers AI (texto, audio, imagen y prompt).</p>

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=githubpages&logoColor=white)](https://jeff-aporta.github.io/cf-ai-front/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Cloudflare Workers AI](https://img.shields.io/badge/API-Workers%20AI-F38020?logo=cloudflare&logoColor=white)](https://github.com/Jeff-Aporta/cf-ai-back)

## Demo

**https://jeff-aporta.github.io/cf-ai-front/**

Las llamadas API usan el gateway configurado en `front-shared` (TargetSwitch local / producción). No hardcodear URLs de workers en el front.

## Uso local

Sirve la carpeta con Live Server (p. ej. `:5500`) e inicia sesión con las mismas credenciales que el resto del ecosistema ISA.

## Pestañas

| Pestaña | Descripción |
|---------|-------------|
| Consultas BD | Chat en lenguaje natural (solo SELECT, requiere login) |
| Hola mundo | Prueba pública GET y POST con sesión |
| Prompt | Completado de prompt |
| Chat | Respuestas de texto |
| Embeddings | Vectores de texto |
| Catálogo | Herramientas y modelos disponibles |

## Repo relacionado

| Rol | Repo |
|-----|------|
| Backend (privado) | [cf-ai-back](https://github.com/Jeff-Aporta/cf-ai-back) |
| Gateway | [main-orchestrator-back](https://github.com/Jeff-Aporta/main-orchestrator-back) |

MIT · Jeff-Aporta
