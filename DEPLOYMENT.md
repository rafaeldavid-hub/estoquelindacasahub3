# Guia de Deploy no Vercel

Este documento contém instruções detalhadas para fazer deploy automático no Vercel com credenciais em tempo real.

## 📋 Pré-requisitos

- Node.js e npm instalados
- Conta no [Vercel](https://vercel.com)
- Acesso ao projeto no Vercel

## 🚀 Setup Rápido (Automatizado)

Execute o script de setup:

```bash
chmod +x setup-vercel.sh
./setup-vercel.sh
```

Este script irá:
1. Solicitar suas credenciais do Vercel
2. Criar o arquivo `.env.local` com as credenciais
3. Exibir os próximos passos

## 🔧 Setup Manual

### Passo 1: Obter o Token do Vercel

1. Acesse [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em **"Create Token"**
3. Preencha:
   - **Token Name**: ex. "Local Development"
   - **Expiration**: Escolha um prazo (recomendado: 7 dias, 30 dias ou sem expiração para CI/CD)
   - **Scope**: Deixe como padrão
4. Clique em **"Create"**
5. **Copie o token** (você não poderá vê-lo novamente)

### Passo 2: Encontrar o Project ID e Org ID

1. Acesse [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá para **Settings** → aba principal
4. Encontre:
   - **Project ID**: Copie este valor
   - **Org ID** (se aplicável): Copie este valor

### Passo 3: Configurar o Arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cat > .env.local << EOF
VERCEL_TOKEN=seu_token_aqui
VERCEL_PROJECT_ID=seu_project_id_aqui
VERCEL_ORG_ID=seu_org_id_aqui
EOF
```

**Importante**: Este arquivo é automaticamente ignorado pelo git (.gitignore).

### Passo 4: Instalar Dependências

Instale a CLI do Vercel:

```bash
npm install
```

## 📤 Fazer Deploy

### Deploy em Staging (Preview)

```bash
npm run deploy
```

Saída esperada:
```
Vercel CLI 34.2.0
✔ Confirmed project name
✔ Linked to your-project
✔ Inspect: https://vercel.com/rafaeldavid-hub/estoquelindacasahub3/...
✔ Preview: https://estoquelindacasahub3-git-main-rafaeldavid-hub.vercel.app
✔ Production: https://estoquelindacasahub3.vercel.app
```

### Deploy em Produção

```bash
npm run deploy:prod
```

## 🔄 Deploy Automático com Git

Para fazer deploy automático a cada push para o Git:

1. Acesse o painel do Vercel
2. Vá para **Settings** → **Git**
3. Conecte seu repositório GitHub
4. Configure as opções de branch e ambiente
5. Clique em **Save**

Depois disso:
- **Merge para `main`** = Deploy automático em produção
- **Push para outras branches** = Deploy em staging

## 🔐 Segurança

- ✅ Credenciais armazenadas em `.env.local`
- ✅ `.env.local` está no `.gitignore`
- ✅ Token pode ser revogado a qualquer momento em Settings → Tokens
- ⚠️ **Nunca** commit `.env.local` ao repositório
- ⚠️ Se o token for vazado, revogue-o imediatamente

## 🆘 Troubleshooting

### Erro: "VERCEL_TOKEN not found"

Verifique se o arquivo `.env.local` existe e contém o token:

```bash
cat .env.local
```

### Erro: "Project not found"

- Verifique se o `VERCEL_PROJECT_ID` está correto
- Verifique se o projeto existe no Vercel
- Tente fazer login novamente: `npx vercel login`

### Erro de Autenticação

Revogue o token antigo e crie um novo:

1. Acesse [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique no ícone de lixeira ao lado do token
3. Crie um novo token
4. Atualize `VERCEL_TOKEN` em `.env.local`

## 📚 Referências

- [Documentação Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deploy Vercel](https://vercel.com/docs/concepts/deployments)

## ✅ Checklist de Setup

- [ ] Token do Vercel criado
- [ ] Project ID obtido
- [ ] Org ID obtido (se aplicável)
- [ ] Arquivo `.env.local` criado
- [ ] Executado `npm install`
- [ ] Testado `npm run deploy`
- [ ] Verificado o deployment no Vercel
