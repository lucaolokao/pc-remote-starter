# Setup inicial

## 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

API em `http://localhost:3000`.

## 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App em `http://localhost:5173`.

## 3) Fluxo inicial

1. Registre usuário em `POST /api/register`.
2. Faça login em `POST /api/login`.
3. No dashboard, use o botão para ligar o PC.
