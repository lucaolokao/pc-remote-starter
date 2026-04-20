# Deploy no Vercel

## Frontend

1. Crie um projeto no Vercel apontando para a pasta `frontend`.
2. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Variável de ambiente:
   - `VITE_API_BASE_URL=https://SEU_BACKEND`

## Backend

Você pode publicar o backend no Vercel como projeto Node:

1. Crie um segundo projeto apontando para `backend`.
2. Configure as variáveis:
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ESP32_BASE_URL`
   - `ESP32_TOKEN`
   - `CORS_ORIGIN`
3. Defina runtime Node.js no painel do Vercel.

> Dica: após o deploy, atualize `VITE_API_BASE_URL` no frontend com a URL final do backend.
