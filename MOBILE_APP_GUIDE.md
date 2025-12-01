# 📱 ChegouAqui - Guia de Criação do App Mobile

## 🎯 Visão Geral

Este guia explica como transformar o ChegouAqui em um app Android nativo usando **Capacitor**.

---

## ✅ O que já foi feito

### 1. **Instalação do Capacitor**
```bash
✅ @capacitor/core
✅ @capacitor/cli
✅ @capacitor/android
✅ @capacitor/splash-screen
✅ @capacitor/status-bar
✅ @capacitor/app
```

### 2. **Projeto Android Criado**
- ✅ Estrutura Android gerada em `/app/frontend/android/`
- ✅ Package name: `com.chegouaqui.app`
- ✅ App name: `ChegouAqui - Portaria`
- ✅ Build do React concluído e sincronizado

### 3. **Configurações Aplicadas**
- ✅ AndroidManifest.xml configurado
- ✅ Permissões adicionadas (Internet, Câmera, Network State)
- ✅ Scripts npm para mobile adicionados ao package.json

### 4. **Funcionalidades do App**
O app mobile incluirá apenas:
- ✅ **Perfil Porteiro**: Envio de notificações de encomendas
- ✅ **Perfil Admin**: Gestão do prédio, apartamentos, usuários
- ❌ **NÃO incluirá**: Super Admin, Cadastro público de moradores

---

## 📋 Próximos Passos

### **ETAPA 1: Adaptar UI para Mobile** ⏳

#### 1.1. Responsividade
As páginas precisam ser otimizadas para telas menores:

**Arquivos a modificar:**
- `/app/frontend/src/pages/Login.js` ✅ (já responsivo)
- `/app/frontend/src/pages/DoormanPanel.js` - Precisa ajustes
- `/app/frontend/src/pages/BuildingAdminPanel.js` - Precisa ajustes

**Ajustes necessários:**
- Tornar tabelas responsivas (scroll horizontal)
- Reduzir tamanho do logo no header para mobile
- Ajustar cards e grids para empilhar em telas pequenas
- Aumentar tamanho de botões para touch (min 44px altura)

#### 1.2. Navegação Mobile
- Adicionar bottom navigation bar ou hamburger menu
- Melhorar área de toque dos botões

---

### **ETAPA 2: Testar o App Localmente** ⏳

#### 2.1. Instalar Android Studio
1. Baixar Android Studio: https://developer.android.com/studio
2. Instalar SDK e emuladores
3. Configurar variáveis de ambiente

#### 2.2. Abrir o projeto Android
```bash
cd /app/frontend
yarn build:mobile
npx cap open android
```

#### 2.3. Testar no Emulador
- Selecionar um device virtual (ex: Pixel 5, Android 11+)
- Clicar em "Run" no Android Studio
- Testar login, navegação e funcionalidades

---

### **ETAPA 3: Configurar Backend URL para Mobile** ⏳

O app mobile precisa se conectar ao backend em produção.

**Atualizar `/app/frontend/capacitor.config.json`:**
```json
{
  "appId": "com.chegouaqui.app",
  "appName": "ChegouAqui",
  "webDir": "build",
  "server": {
    "url": "https://SEU-DOMINIO.emergent.host",
    "cleartext": true,
    "androidScheme": "https"
  }
}
```

**OU** criar build com variável de ambiente:
```bash
REACT_APP_BACKEND_URL=https://SEU-DOMINIO.emergent.host yarn build:mobile
```

---

### **ETAPA 4: Gerar APK/AAB para Testes** ⏳

#### 4.1. Build de Debug (para testar)
```bash
cd /app/frontend/android
./gradlew assembleDebug
```

O APK será gerado em:
`/app/frontend/android/app/build/outputs/apk/debug/app-debug.apk`

#### 4.2. Build de Release (para Google Play)
```bash
cd /app/frontend/android
./gradlew bundleRelease
```

O AAB será gerado em:
`/app/frontend/android/app/build/outputs/bundle/release/app-release.aab`

---

### **ETAPA 5: Criar Ícones e Splash Screen** ⏳

#### 5.1. Ícone do App
Criar ícone 512x512px com o logo ChegouAqui e cores:
- Fundo amarelo (#FFD839)
- Logo em preto (#2A2A2A)

**Ferramenta recomendada:**
- https://icon.kitchen/ (gera todos os tamanhos automaticamente)

**Substituir arquivos em:**
- `/app/frontend/android/app/src/main/res/mipmap-*/ic_launcher.png`
- `/app/frontend/android/app/src/main/res/mipmap-*/ic_launcher_round.png`

#### 5.2. Splash Screen
Criar splash screen 2048x2048px:
- Fundo amarelo (#FFD839)
- Logo centralizado

**Substituir em:**
- `/app/frontend/android/app/src/main/res/drawable/splash.png`

---

### **ETAPA 6: Assinar o App (Keystore)** ⏳

Para publicar no Google Play, é necessário assinar o app.

#### 6.1. Gerar Keystore
```bash
keytool -genkey -v -keystore chegouaqui-release.keystore \
  -alias chegouaqui -keyalg RSA -keysize 2048 -validity 10000
```

**Informações necessárias:**
- Password da keystore
- Nome da organização
- Cidade, Estado, País

#### 6.2. Configurar Gradle
Criar arquivo `/app/frontend/android/key.properties`:
```properties
storePassword=SUA_SENHA
keyPassword=SUA_SENHA
keyAlias=chegouaqui
storeFile=/caminho/para/chegouaqui-release.keystore
```

#### 6.3. Atualizar build.gradle
Adicionar configuração de assinatura no `/app/frontend/android/app/build.gradle`

---

### **ETAPA 7: Publicar no Google Play Store** ⏳

#### 7.1. Criar Conta Google Play Developer
- Acessar: https://play.google.com/console/signup
- Pagar taxa única de $25 USD
- Preencher informações da conta

#### 7.2. Criar Aplicativo
1. Acessar Google Play Console
2. Clicar em "Criar app"
3. Preencher:
   - Nome: ChegouAqui - Portaria
   - Idioma padrão: Português (Brasil)
   - Tipo: App
   - Gratuito/Pago: Gratuito

#### 7.3. Preparar Listing da Store
**Informações necessárias:**

**Descrição Curta (80 caracteres):**
```
Sistema de notificação de encomendas para condomínios
```

**Descrição Completa (4000 caracteres):**
```
ChegouAqui é o sistema inteligente de notificação de encomendas para condomínios.

🏢 PARA PORTEIROS:
- Notifique moradores com um clique
- Envio automático via WhatsApp
- Interface simples e rápida

🏗️ PARA ADMINISTRADORES:
- Gerencie apartamentos e moradores
- Controle de usuários do sistema
- Relatórios de entregas
- Personalização de mensagens

✨ RECURSOS:
- Notificações instantâneas via WhatsApp
- Gestão completa de moradores
- Histórico de entregas
- Múltiplos porteiros
- QR Code para cadastro de moradores

📱 PRATICIDADE:
- Interface moderna e intuitiva
- Funciona em qualquer smartphone
- Rápido e fácil de usar

ChegouAqui torna a gestão de encomendas simples e eficiente!
```

**Screenshots necessários:**
- Mínimo 2, recomendado 8
- Tamanhos: 1080x1920 (9:16) ou 1080x2340
- Mostrar: Login, Painel Porteiro, Painel Admin, Lista de apartamentos

**Ícone da Store:**
- 512x512px PNG
- Transparência não permitida

**Feature Graphic:**
- 1024x500px PNG/JPG
- Imagem destacada que aparece na store

#### 7.4. Configurar Classificação de Conteúdo
- Responder questionário do Google
- Categoria: Utilidades / Produtividade
- Sem conteúdo sensível

#### 7.5. Preços e Distribuição
- Marcar "Gratuito"
- Selecionar países: Brasil (e outros se desejar)
- Aceitar diretrizes do Google Play

#### 7.6. Upload do AAB
1. Ir para "Versões" > "Produção"
2. Criar nova versão
3. Upload do `app-release.aab`
4. Preencher notas da versão:
   ```
   Versão inicial do ChegouAqui
   - Sistema de notificação de encomendas
   - Perfis de Porteiro e Administrador
   - Integração com WhatsApp
   ```

#### 7.7. Enviar para Análise
- Revisar todas as informações
- Enviar para revisão do Google
- Aguardar aprovação (geralmente 1-3 dias)

---

## 🔧 Comandos Úteis

### Build e Sync
```bash
# Build do React + Sync com Android
yarn build:mobile

# Apenas sync (após mudanças no código)
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

### Gradle (dentro de /app/frontend/android)
```bash
# Limpar build
./gradlew clean

# Build debug
./gradlew assembleDebug

# Build release
./gradlew bundleRelease

# Listar tasks disponíveis
./gradlew tasks
```

---

## 📱 Requisitos do Sistema

### Para Desenvolvimento
- Node.js 16+
- Yarn ou npm
- Android Studio
- JDK 11 ou superior
- Android SDK 24+ (Android 7.0)

### Para o App
- Android 7.0 (API 24) ou superior
- Mínimo 50MB de espaço
- Conexão com internet

---

## 🎨 Design Mobile - Diretrizes

### Cores (mantidas do web)
- Amarelo: `#FFD839`
- Preto: `#2A2A2A`
- Cinza Claro: `#F5F5F5`
- Cinza Médio: `#9A9A9A`
- Teal Tech: `#00E2C6`

### Tipografia
- Font: Inter (mesma do web)
- Títulos: Bold 24-32px
- Corpo: Regular 16px
- Botões: Semibold 16px

### Touch Targets
- Botões: mínimo 44x44px
- Espaçamento: 16px entre elementos
- Navegação: 56px de altura

### Responsividade
- Breakpoint mobile: < 768px
- Layout: empilhado verticalmente
- Grids: 1 coluna em mobile

---

## 🐛 Troubleshooting

### Erro: "SDK not found"
```bash
# Configurar ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Erro: "Build failed"
```bash
cd /app/frontend/android
./gradlew clean
cd ..
yarn build:mobile
```

### App não conecta ao backend
- Verificar URL no capacitor.config.json
- Verificar que o backend está acessível publicamente
- Verificar permissão de INTERNET no AndroidManifest

### Ícone não aparece
- Gerar ícones em todos os tamanhos (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Usar ferramenta: https://icon.kitchen/

---

## 📚 Recursos Adicionais

### Documentação
- Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio/intro
- Google Play Console: https://support.google.com/googleplay/android-developer

### Ferramentas
- Icon Kitchen: https://icon.kitchen/ (gerar ícones)
- App Icon Generator: https://appicon.co/ (alternativa)
- Screenshot Framer: https://mockuphone.com/ (screenshots para a store)

---

## ✅ Checklist Final

Antes de publicar na Google Play Store:

- [ ] App funciona corretamente no emulador
- [ ] App testado em dispositivo físico
- [ ] Backend em produção funcionando
- [ ] Ícones em todos os tamanhos
- [ ] Splash screen configurada
- [ ] Screenshots da store prontos
- [ ] Feature graphic criado
- [ ] Descrições escritas (curta e completa)
- [ ] Keystore gerado e salvo em local seguro
- [ ] AAB assinado gerado
- [ ] Conta Google Play Developer criada
- [ ] Taxa de $25 paga
- [ ] Classificação de conteúdo preenchida
- [ ] Política de privacidade criada (se coletar dados)
- [ ] Termos de uso prontos

---

## 📝 Notas Importantes

1. **Keystore**: NUNCA perca o arquivo keystore! Guarde em local seguro. Sem ele, você não poderá atualizar o app.

2. **Versioning**: Para cada nova versão, incremente:
   - `versionCode` em `build.gradle` (número inteiro)
   - `versionName` em `build.gradle` (string, ex: "1.0", "1.1")

3. **Testes**: Sempre teste em dispositivos reais antes de publicar. Emuladores não capturam todos os problemas.

4. **Aprovação**: A primeira aprovação do Google Play pode levar de 1-7 dias. Updates subsequentes são mais rápidos (1-24h).

5. **Política de Privacidade**: Se o app coleta dados (email, telefone, etc.), você PRECISA de uma política de privacidade publicada em URL pública.

---

**Status Atual:** ✅ Projeto Android criado e configurado. Próximo passo: adaptar UI para mobile.
