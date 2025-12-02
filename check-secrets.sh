#!/bin/bash

# Script para verificar secrets antes de fazer commit
# Uso: ./check-secrets.sh

echo "🔍 Verificando possíveis secrets no código..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de problemas
PROBLEMS=0

# 1. Verificar se .env está no staging
echo "1️⃣ Verificando arquivos .env no staging..."
if git diff --cached --name-only | grep -q "\.env$"; then
    echo -e "${RED}❌ ERRO: Arquivo .env está no staging!${NC}"
    echo "   Execute: git reset HEAD *.env"
    PROBLEMS=$((PROBLEMS + 1))
else
    echo -e "${GREEN}✅ Nenhum arquivo .env no staging${NC}"
fi
echo ""

# 2. Verificar patterns de secrets comuns
echo "2️⃣ Verificando patterns de secrets no código..."

# Twilio Account SID (AC + 32 caracteres)
if git diff --cached | grep -q "AC[a-z0-9]\{32\}"; then
    echo -e "${RED}❌ ERRO: Possível Twilio Account SID detectado!${NC}"
    git diff --cached | grep "AC[a-z0-9]\{32\}" | head -3
    PROBLEMS=$((PROBLEMS + 1))
fi

# Auth Tokens (32+ caracteres hexadecimais)
if git diff --cached | grep -E "[0-9a-f]{32,}" | grep -v "exemplo\|example\|template" | grep -q .; then
    echo -e "${YELLOW}⚠️  AVISO: Possível token/hash detectado${NC}"
    git diff --cached | grep -E "[0-9a-f]{32,}" | grep -v "exemplo\|example\|template" | head -3
fi

# JWT secrets comuns
if git diff --cached | grep -iE "secret.*=.*['\"].*[a-z0-9]{20,}" | grep -v "your-secret\|change-me\|example" | grep -q .; then
    echo -e "${RED}❌ ERRO: Possível secret key detectada!${NC}"
    git diff --cached | grep -iE "secret.*=.*['\"].*[a-z0-9]{20,}" | grep -v "your-secret\|change-me\|example" | head -3
    PROBLEMS=$((PROBLEMS + 1))
fi

if [ $PROBLEMS -eq 0 ]; then
    echo -e "${GREEN}✅ Nenhum secret detectado no staging${NC}"
fi
echo ""

# 3. Verificar .gitignore
echo "3️⃣ Verificando .gitignore..."
if grep -q "^\*\.env" .gitignore; then
    echo -e "${GREEN}✅ .gitignore configurado corretamente para .env${NC}"
else
    echo -e "${RED}❌ ERRO: .gitignore não ignora arquivos .env!${NC}"
    echo "   Adicione: *.env ao .gitignore"
    PROBLEMS=$((PROBLEMS + 1))
fi
echo ""

# 4. Verificar arquivos .env.example
echo "4️⃣ Verificando arquivos .env.example..."
if [ -f "backend/.env.example" ] && [ -f "frontend/.env.example" ]; then
    echo -e "${GREEN}✅ Arquivos .env.example existem${NC}"
else
    echo -e "${YELLOW}⚠️  AVISO: Arquivos .env.example não encontrados${NC}"
fi
echo ""

# Resultado final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $PROBLEMS -eq 0 ]; then
    echo -e "${GREEN}✅ VERIFICAÇÃO PASSOU! Seguro para commit.${NC}"
    exit 0
else
    echo -e "${RED}❌ VERIFICAÇÃO FALHOU! $PROBLEMS problema(s) encontrado(s).${NC}"
    echo ""
    echo "Corrija os problemas antes de fazer commit."
    echo "Para mais informações, leia: GITHUB_SECURITY_FIX.md"
    exit 1
fi
