# PC Remote Starter

Projeto para ligar um PC remotamente usando **ESP32 + Backend Node.js/Express + Frontend React/Vite**.

## Estrutura

```text
backend/   API com autenticação JWT
frontend/  Interface web (login + dashboard)
esp32/     Firmware Arduino
docs/      Guias de setup, deploy e testes
```

## Requisitos

- Node.js 18+
- NPM 9+
- ESP32 DevKit
- Relé 10A 250VAC

## Rodando localmente

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Endpoints da API

- `POST /api/register`
- `POST /api/login`
- `POST /api/turn-on` (Bearer token)
- `GET /api/status`
- `GET /api/health`

## Documentação adicional

- `docs/setup.md`
- `docs/vercel-deployment.md`
- `docs/duckdns-setup.md`
- `docs/circuit-diagram.md`
- `docs/testing.md`
