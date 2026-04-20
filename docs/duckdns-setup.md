# DuckDNS Setup Instructions

## Step 1: Create a DuckDNS Account
1. Go to [DuckDNS](https://www.duckdns.org) e clique em 'Sign up'.
2. Você pode se registrar usando sua conta GitHub, Reddit ou Twitter.
3. Após se registrar, você estará logado em sua conta DuckDNS.

## Step 2: Criar seu domínio
1. Em sua conta DuckDNS, insira um nome de domínio no campo "add domain".
2. Clique em 'add domain'. Seu domínio será `seunomedomain.duckdns.org`.
3. Copie o TOKEN que aparece para sua conta.

## Step 3: Configurar no ESP32
Edite a variável `duckdns_token` no arquivo `config.h` do ESP32:

```cpp
const char* duckdns_token = "seu_token_aqui";
const char* duckdns_domain = "seunomedomain.duckdns.org";
```