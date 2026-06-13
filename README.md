# 🐾 AmigoPet - Sistema de Gestão de Petshop

Projeto fullstack completo para gerenciamento de petshop com autenticação JWT, CORS e documentação Swagger.

## 📋 Funcionalidades Implementadas

✅ Autenticação JWT (Login e Registro)
✅ CRUD Completo para: Tutores, Pets, Serviços, Produtos, Agendamentos
✅ API RESTful com Swagger
✅ CORS habilitado
✅ Banco de dados SQLite
✅ Design responsivo e moderno
✅ Fetch API para comunicação frontend-backend
✅ Filtros avançados para agendamentos
✅ Cálculo automático de idade de pets

## 🚀 Como Iniciar

### Backend

```bash
cd backend
npm install
npm start
cd frontend
python -m http.server 8000
# ou
npx http-server -p 8000
projeto-fullstack-amigopet/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       │   ├── db.js
│       │   └── swagger.js
│       ├── middleware/
│       │   └── auth.js
│       ├── models/
│       │   ├── index.js
│       │   ├── user.js
│       │   ├── tutor.js
│       │   ├── pet.js
│       │   ├── service.js
│       │   ├── product.js
│       │   └── appointment.js
│       └── routes/
│           ├── auth.js
│           ├── tutors.js
│           ├── pets.js
│           ├── services.js
│           ├── products.js
│           └── appointments.js
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── tutors.html
    ├── pets.html
    ├── services.html
    ├── products.html
    ├── appointments.html
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── api.js
    │   ├── tutors.js
    │   ├── pets.js
    │   ├── services.js
    │   ├── products.js
    │   └── appointments.js
    └── images/
        ├── dashboard-img.jpeg
        ├── login-img.jpeg
        ├── tutor-img.jpeg
        ├── pet-img.jpeg
        ├── servicos-img.jpeg
        ├── produtos-img.jpeg
        └── agendamento-img.jpeg
🔐 Credenciais de Teste
Após iniciar, crie uma conta em http://localhost:8000/register.html

Exemplo:

Nome: João Silva
Email: joao@example.com
Senha: senha123
📱 Páginas Disponíveis
PáginaURLDescrição
Login/login.htmlAutenticação do usuário
Registro/register.htmlCriar nova conta
Dashboard/index.htmlPágina inicial
Tutores/tutors.htmlGerenciar tutores
Pets/pets.htmlGerenciar pets
Serviços/services.htmlGerenciar serviços
Produtos/products.htmlGerenciar produtos
Agendamentos/appointments.htmlGerenciar agendamentos
🔌 Endpoints da API
Autenticação
POST /auth/register - Registrar usuário
POST /auth/login - Fazer login
Tutores
GET /tutors - Listar todos
POST /tutors - Criar novo
GET /tutors/:id - Obter por ID
PUT /tutors/:id - Atualizar
DELETE /tutors/:id - Deletar
Pets
GET /pets - Listar todos
`POST /pets - Criar novo
GET /pets/:id - Obter por ID
PUT /pets/:id - Atualizar
DELETE /pets/:id - Deletar
Serviços
GET /services - Listar todos
POST /services - Criar novo
GET /services/:id - Obter por ID
PUT /services/:id - Atualizar
DELETE /services/:id - Deletar
Produtos
GET /products - Listar todos
POST /products - Criar novo
GET /products/:id - Obter por ID
PUT /products/:id - Atualizar
DELETE /products/:id - Deletar
Agendamentos
GET /appointments - Listar todos
POST /appointments - Criar novo
GET /appointments/:id - Obter por ID
PUT /appointments/:id - Atualizar
DELETE /appointments/:id - Deletar
🛠️ Tecnologias
Frontend:

HTML5
CSS3 (Grid, Flexbox, Responsivo)
JavaScript (Fetch API)
LocalStorage (para JWT)
Backend:

Node.js
Express.js
Sequelize ORM
SQLite3
JWT (jsonwebtoken)
Bcryptjs
CORS
Swagger/OpenAPI
📝 Notas Importantes
JWT Token: Armazenado em localStorage, válido por 8 horas
Senha: Criptografada com bcrypt
CORS: Habilitado para requisições do frontend
Banco de Dados: SQLite (arquivo: database.sqlite)
Imagens: Coloque os JPEGs na pasta frontend/images/
🔒 Segurança
✅ Autenticação via JWT
✅ Senhas com hash bcrypt
✅ Proteção de rotas com middleware
✅ CORS configurado
✅ Validação básica de entrada
📞 Suporte
Para dúvidas ou problemas:

Verifique se backend está rodando na porta 3000
Verifique se frontend está na porta 8000
Limpe o localStorage se tiver problemas de autenticação
