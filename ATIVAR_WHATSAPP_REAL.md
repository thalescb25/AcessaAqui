# 📱 Como Ativar Envio REAL de WhatsApp

## 🎯 Status Atual

**MVP está em modo SIMULAÇÃO:**
- ✅ Sistema registra entregas no banco de dados
- ✅ Sistema identifica telefones dos moradores
- ✅ Sistema registra tentativas de envio nos logs
- ⚠️ Mensagens WhatsApp são SIMULADAS (não são enviadas de verdade)
- 📋 Logs mostram: `[WHATSAPP SIMULADO] Para: (11) 99999-9999 | Mensagem: ...`

**Por que simular?**
- MVP não requer credenciais reais do Twilio
- Permite testar toda a lógica sem custos
- Demonstração funciona sem depender de API externa

---

## 🚀 Próximos Passos para Ativar WhatsApp Real

### Passo 1: Criar Conta no Twilio

1. **Acessar:** https://www.twilio.com/try-twilio
2. **Criar conta gratuita** (crédito de teste: $15 USD)
3. **Verificar email e telefone**

### Passo 2: Configurar WhatsApp no Twilio

#### Opção A: Sandbox (Teste Rápido - GRATUITO)
Para testes imediatos sem aprovação:

1. Acesse: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. **Anotar o número WhatsApp do Twilio:** `+1 415 523 8886` (ou similar)
3. **Anotar o código de ativação:** `join <palavra-chave>`
4. **Testar o sandbox:**
   - Adicionar o número do Twilio nos seus contatos
   - Enviar mensagem: `join <palavra-chave>`
   - Você receberá confirmação do Twilio

**IMPORTANTE para Sandbox:**
- Cada número de teste precisa enviar `join <palavra-chave>` primeiro
- Válido apenas para testes com números cadastrados
- Limite de mensagens por hora

#### Opção B: WhatsApp Business API (PRODUÇÃO)
Para uso profissional com moradores reais:

1. **Acesse:** Console Twilio → Messaging → Try it Out → WhatsApp
2. **Solicitar número WhatsApp dedicado:**
   - Click em "Request to enable WhatsApp"
   - Preencher informações da empresa
   - Aguardar aprovação do Facebook/Meta (1-7 dias)
3. **Configurar template de mensagens:**
   - Meta requer aprovação de templates
   - Submeter template similar ao usado no sistema

**Custos (aproximados):**
- Conversação iniciada pelo negócio: $0.005 - $0.01 por mensagem
- Número WhatsApp: ~$1-2/mês

### Passo 3: Obter Credenciais do Twilio

1. **Acesse o Dashboard:** https://console.twilio.com/
2. **Anotar:**
   - **Account SID:** `ACxxxxxxxxxxxxxxxxx` (público)
   - **Auth Token:** `xxxxxxxxxxxxxxxx` (secreto - não compartilhar)
3. **Anotar Número WhatsApp:**
   - Sandbox: `whatsapp:+14155238886`
   - Produção: Seu número aprovado, ex: `whatsapp:+5511999999999`

### Passo 4: Configurar no ChegouAqui

1. **Editar arquivo .env do backend:**
```bash
nano /app/backend/.env
```

2. **Adicionar/Atualizar as linhas:**
```bash
# Twilio WhatsApp (REAL)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="seu_auth_token_aqui"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

3. **Salvar e sair:** `Ctrl+X` → `Y` → `Enter`

### Passo 5: Ativar Código Real no Backend

1. **Editar server.py:**
```bash
nano /app/backend/server.py
```

2. **Localizar a função `send_whatsapp_message` (linha ~260)**

3. **Descomentar o código real e comentar a simulação:**

**ANTES (simulação):**
```python
async def send_whatsapp_message(phone: str, message: str) -> tuple[bool, Optional[str]]:
    """
    Simula envio de WhatsApp via Twilio (sandbox para MVP)
    Retorna (success, error_message)
    """
    try:
        # Em produção, usar Twilio API:
        # from twilio.rest import Client
        # client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        # message = client.messages.create(
        #     from_=TWILIO_WHATSAPP_NUMBER,
        #     body=message,
        #     to=f'whatsapp:{phone}'
        # )
        
        # Para MVP: simular sucesso
        logging.info(f"[WHATSAPP SIMULADO] Para: {phone} | Mensagem: {message}")
        return (True, None)
    except Exception as e:
        logging.error(f"Erro ao enviar WhatsApp: {str(e)}")
        return (False, str(e))
```

**DEPOIS (real):**
```python
async def send_whatsapp_message(phone: str, message: str) -> tuple[bool, Optional[str]]:
    """
    Envia WhatsApp via Twilio API
    Retorna (success, error_message)
    """
    try:
        from twilio.rest import Client
        
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Formatar número para padrão internacional
        # Remove parênteses, espaços e hífens
        phone_clean = phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
        
        # Se não começa com +, adicionar código do país (Brasil = +55)
        if not phone_clean.startswith('+'):
            phone_clean = f'+55{phone_clean}'
        
        # Enviar mensagem
        msg = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body=message,
            to=f'whatsapp:{phone_clean}'
        )
        
        logging.info(f"[WHATSAPP ENVIADO] SID: {msg.sid} | Para: {phone_clean} | Status: {msg.status}")
        return (True, None)
        
    except Exception as e:
        logging.error(f"Erro ao enviar WhatsApp: {str(e)}")
        return (False, str(e))
```

4. **Salvar e sair:** `Ctrl+X` → `Y` → `Enter`

### Passo 6: Reiniciar Backend

```bash
sudo supervisorctl restart backend
```

### Passo 7: Verificar Logs

```bash
tail -f /var/log/supervisor/backend.*.log
```

Agora deve aparecer:
```
[WHATSAPP ENVIADO] SID: SMxxxxx | Para: +5511999999999 | Status: queued
```

---

## 🧪 Testar Envio Real

### Teste 1: Sandbox (Simples)

1. **Seu celular deve "entrar" no sandbox primeiro:**
   - Adicionar número Twilio nos contatos: `+1 415 523 8886`
   - Enviar mensagem: `join <palavra-chave>` (veja no console Twilio)
   - Aguardar confirmação

2. **Cadastrar seu número no ChegouAqui:**
   - Acesse: `/registrar?codigo=33HFYMBPWU4`
   - Preencher com seu número: `(11) 99999-9999`
   - Escolher um apartamento

3. **Registrar entrega:**
   - Login como porteiro: `joao@sunset.com` / `joao123`
   - Clicar no apartamento que você cadastrou
   - **Você deve receber a mensagem no WhatsApp! 🎉**

### Teste 2: Verificar no Console Twilio

1. Acesse: https://console.twilio.com/us1/monitor/logs/messages
2. Ver mensagens enviadas em tempo real
3. Status possíveis:
   - `queued`: Na fila
   - `sent`: Enviado
   - `delivered`: Entregue
   - `failed`: Falhou (ver erro)

---

## 🔧 Troubleshooting

### Erro: "Unverified number"
**Causa:** Número não cadastrado no sandbox  
**Solução:** Enviar `join <palavra-chave>` do número de destino

### Erro: "Invalid phone number"
**Causa:** Formato incorreto  
**Solução:** Verificar formatação no código (deve ter +55 para Brasil)

### Erro: "Authentication failed"
**Causa:** Credenciais incorretas  
**Solução:** Verificar Account SID e Auth Token no .env

### Erro: "Insufficient balance"
**Causa:** Créditos esgotados  
**Solução:** Adicionar créditos na conta Twilio

### Mensagens não chegam
1. Verificar logs do sistema: `tail -f /var/log/supervisor/backend.*.log`
2. Verificar logs do Twilio: Console → Monitor → Logs → Messages
3. Verificar se número tem WhatsApp ativo
4. Para sandbox: verificar se fez `join` corretamente

---

## 💰 Custos Estimados

### Twilio WhatsApp Business API (Produção):

**Mensal para um prédio médio (100 entregas/mês):**
- Número WhatsApp: $1-2/mês
- Mensagens (100 entregas × 2 moradores): 200 × $0.008 = $1.60
- **Total estimado: $3-4/mês**

**Mensal para 10 prédios (1000 entregas/mês):**
- Números WhatsApp: 10 × $2 = $20/mês
- Mensagens: 2000 × $0.008 = $16
- **Total estimado: $36/mês**

**Nota:** Preços variam por região. Brasil pode ter custos diferentes.

---

## 🎯 Checklist de Ativação

- [ ] Criar conta Twilio
- [ ] Escolher: Sandbox (teste) ou WhatsApp Business API (produção)
- [ ] Obter credenciais (Account SID, Auth Token, Número)
- [ ] Atualizar `/app/backend/.env` com credenciais reais
- [ ] Editar `/app/backend/server.py` - ativar código real
- [ ] Reiniciar backend: `sudo supervisorctl restart backend`
- [ ] Se sandbox: fazer `join` do seu celular
- [ ] Cadastrar seu número no sistema
- [ ] Testar envio de entrega
- [ ] Verificar recebimento no WhatsApp ✅
- [ ] Verificar logs do Twilio Console

---

## 📞 Suporte Twilio

- **Documentação:** https://www.twilio.com/docs/whatsapp
- **Console:** https://console.twilio.com/
- **Suporte:** https://support.twilio.com/

---

## 🔐 Segurança

**IMPORTANTE:**
- ⚠️ NUNCA commitar credenciais no Git
- ⚠️ Auth Token é SECRETO - não compartilhar
- ✅ Usar variáveis de ambiente (.env)
- ✅ Adicionar `.env` no `.gitignore`
- ✅ Rotacionar tokens periodicamente

---

## 🚀 Status Após Ativação

Quando ativado com Twilio real:
- ✅ Porteiro clica no apartamento
- ✅ Sistema busca telefones no banco
- ✅ Sistema envia WhatsApp VIA TWILIO API
- ✅ Moradores recebem notificação REAL no celular
- ✅ Logs mostram: `[WHATSAPP ENVIADO] SID: SMxxxxx`
- ✅ Sistema registra no banco (deliveries, whatsapp_logs)
- ✅ Admin vê histórico completo

**Sistema totalmente funcional e em produção! 🎉**
