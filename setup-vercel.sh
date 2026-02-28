#!/bin/bash

# Script para configurar credenciais do Vercel
# Este script ajuda a configurar as variáveis de ambiente para deploy automático

echo "=========================================="
echo "Configuração de Credenciais do Vercel"
echo "=========================================="
echo ""

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo "⚠️  Arquivo .env.local já existe!"
    read -p "Deseja sobrescrever? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Abortado."
        exit 1
    fi
fi

# Solicitar credenciais
echo "Para obter suas credenciais, visite:"
echo "1. Token: https://vercel.com/account/tokens"
echo "2. Project ID e Org ID: https://vercel.com/dashboard"
echo ""

read -p "Digite seu VERCEL_TOKEN: " VERCEL_TOKEN
read -p "Digite seu VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID
read -p "Digite seu VERCEL_ORG_ID (deixe vazio se não houver): " VERCEL_ORG_ID

# Criar arquivo .env.local
cat > .env.local << EOF
# Credenciais do Vercel para Deploy Automático
VERCEL_TOKEN=$VERCEL_TOKEN
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
EOF

if [ ! -z "$VERCEL_ORG_ID" ]; then
    echo "VERCEL_ORG_ID=$VERCEL_ORG_ID" >> .env.local
fi

echo ""
echo "✅ Arquivo .env.local criado com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. Instale a CLI do Vercel: npm install -g vercel"
echo "2. Faça o deploy: npm run deploy"
echo "3. Para produção: npm run deploy:prod"
echo ""
