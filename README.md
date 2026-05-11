# CourseSphere

Sistema full stack para gerenciamento de cursos e lessons com autenticação JWT, permissões de usuário e integração com API externa.

## Preview

O sistema permite:

- autenticação JWT
- login/logout
- rotas protegidas
- gerenciamento de cursos
- gerenciamento de lessons
- dashboard moderna
- CRUD completo

## Dados para teste

Usuário 1:
email: admin@test.com
senha: 123456

Usuário 2:
email: user@test.com
senha: 123456

---

# Tecnologias

## Frontend

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express
- SQLite
- JWT
- bcrypt

---

# Funcionalidades

## Autenticação

- Registro de usuários
- Login JWT
- Logout
- Rotas protegidas

## Cursos

- CRUD completo
- Busca por nome
- Controle de permissões
- Apenas criador pode editar/deletar

## Lessons

- CRUD completo
- Status draft/published

### Integrações
- API externa com instrutor convidado

---

# Estrutura do Projeto

```txt
project-root
│
├── coursesphere-backend
│
└── coursesphere-frontend
```

---

# Como rodar o projeto

## Backend

Entre na pasta:

```bash
cd coursesphere-backend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm run dev
```

Servidor:

```txt
http://localhost:3000
```

---

## Frontend

Entre na pasta:

```bash
cd coursesphere-frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o frontend:

```bash
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

---

# Melhorias futuras

- Deploy
- PostgreSQL
- Upload de imagens
- Dark mode
- TypeScript

---

## Licença

Projeto desenvolvido para fins educacionais.
