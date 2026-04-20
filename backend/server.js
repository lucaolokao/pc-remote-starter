const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? '' : crypto.randomBytes(32).toString('hex'));
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
const esp32BaseUrl = process.env.ESP32_BASE_URL || '';
const esp32Token = process.env.ESP32_TOKEN || '';

if (!jwtSecret) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origem não permitida por CORS.'));
    },
  })
);
app.use(express.json());

const users = [];
const turnOnRateLimitMap = new Map();
const turnOnRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Aguarde 1 minuto.' },
});

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

function inMemoryTurnOnRateLimiter(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 5;

  const current = turnOnRateLimitMap.get(key);
  if (!current || now - current.windowStart > windowMs) {
    turnOnRateLimitMap.set(key, { windowStart: now, count: 1 });
    return next();
  }

  if (current.count >= limit) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde 1 minuto.' });
  }

  current.count += 1;
  turnOnRateLimitMap.set(key, current);
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

app.post('/api/register', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
  }

  const existing = users.find((user) => user.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, email, passwordHash };
  users.push(newUser);

  return res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
});

app.post('/api/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const user = users.find((entry) => entry.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  return res.json({
    token: createToken(user),
    user: { id: user.id, email: user.email },
  });
});

app.get('/api/status', async (_req, res) => {
  if (!esp32BaseUrl) {
    return res.status(503).json({ status: 'offline', esp32_online: false, error: 'ESP32_BASE_URL não configurado.' });
  }

  try {
    const url = `${esp32BaseUrl.replace(/\/$/, '')}/status${esp32Token ? `?token=${encodeURIComponent(esp32Token)}` : ''}`;
    const response = await axios.get(url, { timeout: 3000 });
    return res.json({ status: 'online', esp32_online: true, esp32: response.data });
  } catch (_error) {
    return res.status(503).json({ status: 'offline', esp32_online: false });
  }
});

app.post('/api/turn-on', turnOnRateLimiter, inMemoryTurnOnRateLimiter, authMiddleware, async (_req, res) => {
  if (!esp32BaseUrl || !esp32Token) {
    return res.status(503).json({ error: 'Configuração do ESP32 incompleta.' });
  }

  try {
    const url = `${esp32BaseUrl.replace(/\/$/, '')}/turn-on?token=${encodeURIComponent(esp32Token)}`;
    const response = await axios.get(url, { timeout: 3000 });
    return res.json({ success: true, message: 'Comando enviado para ligar o PC.', esp32: response.data });
  } catch (_error) {
    return res.status(502).json({ success: false, error: 'Não foi possível comunicar com o ESP32.' });
  }
});

app.listen(port, () => {
  console.log(`Backend online em http://localhost:${port}`);
});
