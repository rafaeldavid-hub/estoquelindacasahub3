# ⚙️ Configuração do Vercel - Passo a Passo Visual

## Opção 1️⃣: Usando o Script Automatizado (Recomendado)

```bash
chmod +x setup-vercel.sh
./setup-vercel.sh
```

O script vai fazer tudo por você! Siga as instruções na tela.

---

## Opção 2️⃣: Configuração Manual (Passo a Passo)

### PASSO 1: Obter Token do Vercel

**URL:** https://vercel.com/account/tokens

```
┌─────────────────────────────────────────┐
│  Vercel Dashboard                       │
│  ─────────────────────────────────────  │
│                                         │
│  Tokens                                 │
│  ┌─ Create Token ──────────────────┐   │
│  │ Token Name:  Local Dev          │   │
│  │ Expiration:  7 days ▼           │   │
│  │ Scope:       Full Account ▼     │   │
│  │                                 │   │
│  │  [Create Token]                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Seu Token: abc123def456ghi...xyz      │
│  ✂️  Copiar                             │
│                                         │
└─────────────────────────────────────────┘
```

**Ação:** 
1. Clique em "Create Token"
2. Configure o nome e expiração
3. Clique em "Create"
4. **Copie o token** (salve em algum lugar temporário)

---

### PASSO 2: Encontrar IDs do Projeto

**URL:** https://vercel.com/dashboard → Seu Projeto → Settings

```
┌─────────────────────────────────────────┐
│  Project Settings                       │
│  ─────────────────────────────────────  │
│                                         │
│  Project Information                    │
│  ┌─────────────────────────────────┐   │
│  │ Project Name: meu-projeto       │   │
│  │ Project ID:   prj_abc123456     │   │ ← Copie este
│  │ Org ID:       org_xyz789        │   │ ← E este também
│  │ Git Repo:     github.com/...    │   │
│  │ Framework:    Vite              │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Ação:**
1. Vá para seu projeto no Vercel
2. Clique em **Settings**
3. Copie **Project ID** e **Org ID**

---

### PASSO 3: Criar Arquivo `.env.local`

Na raiz do seu projeto, crie o arquivo `.env.local`:

```bash
# No Terminal:
cat > .env.local << EOF
VERCEL_TOKEN=YOUR_TOKEN_HERE
VERCEL_PROJECT_ID=YOUR_PROJECT_ID_HERE
VERCEL_ORG_ID=YOUR_ORG_ID_HERE
EOF
```

**Ou manualmente:**
1. Crie um arquivo chamado `.env.local` na pasta raiz
2. Cole o conteúdo:

```env
VERCEL_TOKEN=abc123def456ghi...xyz
VERCEL_PROJECT_ID=prj_abc123456
VERCEL_ORG_ID=org_xyz789
```

> ⚠️ **IMPORTANTE:** Este arquivo é ignorado pelo Git. Seus segredos estão seguros!

---

### PASSO 4: Validar Configuração

```bash
# Verificar se o arquivo foi criado:
cat .env.local

# Deve exibir algo como:
# VERCEL_TOKEN=abc123...
# VERCEL_PROJECT_ID=prj_abc...
# VERCEL_ORG_ID=org_xyz...
```

---

## 🚀 Fazer Deploy

### Deploy em Staging (Teste)

```bash
npm run deploy
```

**Esperado:**
```
✔ Confirmed project name: estoquelindacasahub3
✔ Linked to rafaeldavid-hub/estoquelindacasahub3
✔ Inspect: https://vercel.com/...
✔ Preview: https://estoquelindacasahub3-git-main-....vercel.app
✨ Done
```

### Deploy em Produção

```bash
npm run deploy:prod
```

---

## 🔐 Segurança - IMPORTANTE

| ✅ Faça | ❌ Não Faça |
|--------|-----------|
| Armazene em `.env.local` | Commit `.env.local` ao Git |
| Revogue token se vazar | Compartilhe seu token |
| Use expiração de token | Use tokens sem expiração |
| Copie token imediatamente | Guarde token em histórico |

---

## 📱 Deploy Automático com Git

Para fazer deploy automático a cada push:

```
1. Vercel.com → Dashboard
2. Seu Projeto → Settings
3. Git → Connect Repository
4. Configure branches (main = produção)
5. Salve
```

A partir daí:
- ✅ Push para `main` → Deploy automático em produção
- ✅ Push para outras branches → Deploy em staging

---

## ❓ Tive Problemas

### "VERCEL_TOKEN not found"
```bash
# Verifique o arquivo:
ls -la .env.local
cat .env.local
```

### "Project not found"
```bash
# Verifique os IDs:
cat .env.local | grep VERCEL_PROJECT_ID
```

### "Token expirado"
```bash
# Crie um novo token em:
# https://vercel.com/account/tokens
# E atualize .env.local
```

---

## ✅ Checklist Final

```
□ Token criado em https://vercel.com/account/tokens
□ Project ID copiado
□ Org ID copiado (se aplicável)
□ Arquivo .env.local criado
□ Credenciais verificadas com: cat .env.local
□ Npm install executado: npm install
□ Teste de deploy: npm run deploy
□ Deploy em produção: npm run deploy:prod
```

---

**Dúvidas?** Consulte [DEPLOYMENT.md](DEPLOYMENT.md) para documentação completa.
