# Contratos de API e Integração Backend

## 1. DADOS MOCKADOS NO FRONTEND (mockData.js)

### Dados que serão substituídos por APIs reais:
- `mockVisitors` → API de visitantes
- `mockStats` → API de estatísticas
- `mockUsers` → API de autenticação
- `heroSlides`, `features`, `segments`, `testimonials`, `clients` → Dados mantidos no frontend (conteúdo estático)

## 2. API ENDPOINTS

### Autenticação
**POST /api/auth/login**
```json
Request:
{
  "email": "admin@example.com",
  "password": "senha123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin",
    "building": "Nome do Edifício"
  }
}
```

**POST /api/auth/register**
```json
Request:
{
  "email": "novo@example.com",
  "password": "senha123",
  "name": "Nome",
  "building": "Nome do Edifício"
}

Response:
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

### Visitantes
**GET /api/visitors**
Query params: ?status=all|checked-in|checked-out&search=nome

```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "visitor_id",
      "name": "João Santos",
      "document": "123.456.789-00",
      "company": "Tech Solutions",
      "host": "Maria Silva",
      "checkInTime": "2024-12-02T09:30:00",
      "checkOutTime": "2024-12-02T11:45:00",
      "status": "checked-out",
      "qrCode": "QR123456"
    }
  ]
}
```

**POST /api/visitors**
```json
Request:
{
  "name": "João Santos",
  "document": "123.456.789-00",
  "company": "Tech Solutions",
  "host": "Maria Silva"
}

Response:
{
  "success": true,
  "data": {
    "id": "visitor_id",
    "qrCode": "QR123456",
    ...visitor_data
  }
}
```

**PUT /api/visitors/:id/checkout**
```json
Response:
{
  "success": true,
  "message": "Check-out realizado"
}
```

**GET /api/visitors/:id/qrcode**
```json
Response:
{
  "success": true,
  "qrCode": "QR123456",
  "qrCodeImage": "base64_image_data"
}
```

### Estatísticas
**GET /api/stats**
```json
Response:
{
  "success": true,
  "data": {
    "todayVisitors": 24,
    "activeVisitors": 8,
    "totalVisitorsMonth": 387,
    "averageStayTime": "2h 15min"
  }
}
```

### Newsletter
**POST /api/newsletter/subscribe**
```json
Request:
{
  "email": "usuario@example.com"
}

Response:
{
  "success": true,
  "message": "Inscrito com sucesso"
}
```

## 3. MODELOS DO BANCO DE DADOS (MongoDB)

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: ['admin', 'receptionist']),
  building: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Visitor
```javascript
{
  _id: ObjectId,
  name: String,
  document: String,
  company: String,
  host: String,
  checkInTime: Date,
  checkOutTime: Date (nullable),
  status: String (enum: ['checked-in', 'checked-out']),
  qrCode: String (unique),
  userId: ObjectId (ref: User),
  building: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Newsletter
```javascript
{
  _id: ObjectId,
  email: String (unique),
  subscribedAt: Date
}
```

## 4. INTEGRAÇÃO FRONTEND → BACKEND

### Substituições necessárias:

1. **Login.jsx**
   - Remover mock authentication
   - Adicionar chamada para `/api/auth/login`
   - Armazenar token JWT no localStorage
   - Adicionar interceptor axios para incluir token

2. **Dashboard.jsx**
   - Substituir `mockVisitors` por `GET /api/visitors`
   - Substituir `mockStats` por `GET /api/stats`
   - Implementar ações reais:
     - Adicionar visitante → `POST /api/visitors`
     - Gerar QR Code → `GET /api/visitors/:id/qrcode`
     - Fazer checkout → `PUT /api/visitors/:id/checkout`

3. **Footer.jsx**
   - Newsletter submit → `POST /api/newsletter/subscribe`

### Utilitários a criar:

**frontend/src/utils/api.js**
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_URL
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 5. SEGURANÇA

- Senhas hasheadas com bcrypt
- JWT tokens para autenticação
- Validação de entrada em todos os endpoints
- Proteção contra SQL injection (usando MongoDB queries seguras)
- Rate limiting para login
- CORS configurado corretamente

## 6. FLUXO DE IMPLEMENTAÇÃO

1. ✅ Frontend com mock data criado
2. ⏳ Criar modelos MongoDB
3. ⏳ Criar endpoints de autenticação
4. ⏳ Criar endpoints de visitantes
5. ⏳ Criar endpoint de estatísticas
6. ⏳ Criar endpoint de newsletter
7. ⏳ Integrar frontend com backend
8. ⏳ Testar toda a aplicação
9. ⏳ Deploy

## 7. VALIDAÇÕES

### Visitante:
- Nome: obrigatório, mínimo 3 caracteres
- Documento: obrigatório, formato CPF válido
- Empresa: obrigatório
- Host: obrigatório

### Usuário:
- Email: obrigatório, formato válido, único
- Senha: obrigatório, mínimo 6 caracteres
- Nome: obrigatório
- Building: obrigatório

## 8. TRATAMENTO DE ERROS

Todos os endpoints retornam estrutura consistente:

**Sucesso:**
```json
{
  "success": true,
  "data": {...}
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```
