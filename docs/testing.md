# Como testar tudo

## Backend

```bash
cd backend
npm install
npm start
```

Health check:

```bash
curl http://localhost:3000/api/health
```

## Registro e login

```bash
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"email":"user@teste.com","password":"123456"}'

curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"user@teste.com","password":"123456"}'
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` e faça login.

## ESP32

Com o ESP32 conectado, valide:

```bash
curl "http://IP_DO_ESP32/health"
curl "http://IP_DO_ESP32/status"
curl "http://IP_DO_ESP32/turn-on?token=SEU_TOKEN"
```
