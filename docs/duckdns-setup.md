# Configurar DuckDNS

1. Acesse `https://www.duckdns.org` e faça login.
2. Crie um subdomínio (ex: `meupc.duckdns.org`).
3. Copie seu token da conta DuckDNS.
4. No roteador, configure redirecionamento da porta 80 para o IP local do ESP32.
5. Configure atualização de IP dinâmico no roteador ou em um cliente DuckDNS.
6. No backend, use:

```env
ESP32_BASE_URL=http://meupc.duckdns.org
ESP32_TOKEN=seu_token_compartilhado
```

Teste:

```bash
curl "http://meupc.duckdns.org/health"
```
