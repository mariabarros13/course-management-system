Sistema full stack para gerenciamento de cursos e lessons, com autenticação JWT, permissões de usuário e geração automática de legendas via IA (Whisper) para os vídeos das aulas.
 
 ## Preview
 
 O sistema permite:

 autenticação JWT (registro/login)
 gerenciamento de cursos (CRUD, apenas o criador edita/deleta)
 gerenciamento de lessons (CRUD, status draft/published)
 upload de vídeo por lesson
 geração automática de legenda (.vtt) em background via fila + Whisper
 front-end de exemplo focado em acessibilidade (legendas, navegação por teclado)
 
 ## Dados para teste
 
@@ -24,25 +26,28 @@ Usuário 2:
 email: user@test.com
 senha: 123456
 
 Esses usuários só existem se você os criar via `/auth/register` em um banco local — não há seed automático.
+
 ---
 
 # Tecnologias
 
## Backend

Node.js + Express 5
SQLite (via `sqlite3`)
JWT (`jsonwebtoken`) + `bcryptjs`
Multer (upload de vídeo)
BullMQ + Redis (fila de processamento em background)
OpenAI Whisper API (transcrição de vídeo → legenda .vtt)
 

## Frontend (`frontend_incluso`)
 
Next.js 14 (App Router)
React 18
Tailwind CSS
Hoje consome dados mockados (`lib/courses.js`) — ainda não está
conectado ao backend real (ver `frontend_incluso/README.md`)
 
 ---
 
@@ -52,101 +57,104 @@ senha: 123456
 
Rotas protegidas via `authMiddleware`
 
 ## Cursos
 
Controle de permissões (apenas o criador pode editar/deletar)
 
 ## Lessons
 
Status `draft` / `published`
Upload de vídeo (mp4, webm, mov, mkv — até 500MB)

## Legendas automáticas (IA)
 
### Integrações

Ao criar uma lesson com vídeo, o backend:

1. salva o arquivo e responde imediatamente (não bloqueia a requisição);
2. enfileira um job de transcrição (BullMQ/Redis);
3. um worker separado baixa/lê o vídeo, chama a API Whisper e salva o `.vtt`;
4. o status fica disponível em `GET /lessons/:id/subtitle-status`
 (`none` → `processing` → `completed` | `failed`), para o frontend fazer polling.
 
 ---
 
 # Estrutura do Projeto
 
 ```txt
course-management-system
 │
-├── coursesphere-backend # API Express + worker de transcrição
+│   └── src/
+│       ├── config/           # paths, conexão Redis, segredo JWT
+│       ├── controllers/
+│       ├── middleware/
+│       ├── database/         # sqlite3 + helpers em Promise
+│       ├── queues/           # fila e worker BullMQ (legendas)
+│       ├── repositories/
+│       ├── routes/
+│       └── services/         # Whisper, geração de .vtt, resolução de vídeo
 │
-└── coursesphere-frontend-incluso/ # Next.js — front-end de exemplo (dados mockados)      
 ```
 
 ---
 
 # Como rodar o projeto
 
-## Backend
-
-Entre na pasta:
+## 1. Redis (necessário para a fila de legendas)
 
 ```bash
-cd coursesphere-backend
+cd backend
+docker compose up -d
 ```
 
-Instale as dependências:
+## 2. Backend — API
 
 ```bash
+cd backend
+cp .env.example .env   # defina JWT_SECRET e OPENAI_API_KEY
 npm install
-```
-
-Inicie o servidor:
-
-```bash
 npm run dev
 ```
 
-Servidor:
+API em `http://localhost:3000`.
 
-```txt
-http://localhost:3000
-```
+## 3. Backend — worker de transcrição (processo separado)
 
----
-
-## Frontend
-
-Entre na pasta:
+Sem o worker rodando, vídeos enviados ficam com `subtitle_status: "processing"`
+indefinidamente — os jobs ficam na fila aguardando.
 
 ```bash
-cd coursesphere-frontend
+cd backend
+npm run dev:worker
 ```
 
-Instale as dependências:
+## 4. Frontend
 
 ```bash
+cd frontend_incluso
 npm install
-```
-
-Inicie o frontend:
-
-```bash
 npm run dev
 ```
 
-Frontend:
-
-```txt
-http://localhost:5173
-```
+Frontend em `http://localhost:3000` (Next.js) — ajuste a porta se a API já estiver
+usando a 3000.
 
 ---
 
 # Melhorias futuras
 
+- Conectar o frontend ao backend real (hoje os dados são mockados)
 - Deploy
-- PostgreSQL
-- Upload de imagens
+- Migrar de SQLite para PostgreSQL
+- Endpoint de busca de cursos por nome
+- Rate limiting e `helmet` na API
+- Testes automatizados e CI
+- Upload de imagens de capa para cursos
 - Dark mode
 - TypeScript
