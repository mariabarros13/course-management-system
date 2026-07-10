# Incluso

Sistema de gerenciamento de cursos e aulas com **geração automática de legendas via IA**. Instrutores fazem upload de vídeos e o sistema transcreve o áudio em segundo plano usando a API Whisper da OpenAI, produzindo legendas `.vtt` sem bloquear a interface.

---

## Funcionalidades

**Autenticação**
- Registro e login com JWT
- Rotas protegidas por token
- Senhas armazenadas com bcrypt

**Cursos**
- Criar, listar, ver, editar e deletar cursos
- Somente o criador do curso pode editá-lo ou deletá-lo
- Deletar um curso remove automaticamente todas as suas aulas

**Aulas**
- Criar, editar, deletar e listar aulas por curso
- Status `draft` ou `published`
- Upload de vídeo (mp4, webm, mov, mkv — até 500 MB)

**Legendas automáticas (Whisper)**
- Ao criar uma aula com vídeo, o sistema enfileira um job de transcrição
- O job roda em processo separado (worker), sem bloquear a API
- O frontend faz polling em `GET /lessons/:id/subtitle-status` até o arquivo `.vtt` ficar pronto
- 3 tentativas automáticas com backoff exponencial (5 s → 10 s → 20 s) em caso de falha
- Status visível: `none` → `processing` → `completed` | `failed`

---

## Stack

| Camada | Tecnologia |
|---|---|
| API | Node.js 22 + Express 5 |
| Banco | SQLite (via `sqlite3`) |
| Autenticação | JWT (`jsonwebtoken`) + `bcryptjs` |
| Upload | Multer (disco local) |
| Fila | BullMQ + Redis 7 |
| Transcrição | OpenAI Whisper (`whisper-1`) |
| Frontend | Next.js 14 (App Router) + Tailwind CSS |

---

## Estrutura do projeto

```
Incluso-Plataforma-de-Cursos-Acessivel/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── auth.js              # leitura do JWT_SECRET com fail-fast
│   │   │   ├── paths.js             # diretórios de uploads/legendas
│   │   │   └── redisConnection.js   # configuração da conexão Redis
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── CourseController.js
│   │   │   └── LessonController.js
│   │   ├── database/
│   │   │   ├── db.js                # instância do SQLite
│   │   │   ├── dbHelpers.js         # wrappers Promise (dbGet, dbRun)
│   │   │   └── init.js              # criação das tabelas + migrações
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # valida JWT em rotas protegidas
│   │   │   └── uploadMiddleware.js  # multer: aceita mp4/webm/mov/mkv, máx 500 MB
│   │   ├── queues/
│   │   │   ├── transcriptionQueue.js   # producer — enfileira o job
│   │   │   └── transcriptionWorker.js  # consumer — processa a transcrição
│   │   ├── repositories/
│   │   │   └── lessonRepository.js  # atualiza subtitle_status no banco
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   └── lessonRoutes.js
│   │   ├── services/
│   │   │   ├── subtitleService.js    # salva o .vtt em disco
│   │   │   ├── videoSourceService.js # resolve vídeo (upload local ou URL externa)
│   │   │   └── whisperService.js     # chama a API Whisper
│   │   └── server.js
│   ├── uploads/                      # gerado automaticamente
│   │   ├── videos/                   # vídeos enviados pelos instrutores
│   │   └── subtitles/                # arquivos .vtt gerados pelo worker
│   ├── docker-compose.yml            # sobe o Redis
│   ├── package.json
│   └── .env.example
│
└── frontend-incluso/
    └── novo-frontend/
        ├── app/
        │   ├── page.tsx              # home — hero + meus cursos
        │   ├── cursos/page.tsx       # catálogo com filtros
        │   ├── instrutor/page.tsx    # painel do instrutor
        │   ├── login/page.tsx
        │   └── cadastro/page.tsx
        ├── components/
        │   ├── Header.tsx
        │   └── CourseCard.tsx
        ├── lib/
        │   └── api.ts                # funções para chamar o backend
        └── .env.example
```

---

## Como rodar

### Pré-requisitos

- Node.js 22+
- Docker (para o Redis) — ou um Redis local já rodando na porta 6379
- Chave de API da OpenAI (apenas para o worker de legendas)

### 1. Redis

```bash
cd backend
docker compose up -d
```

### 2. Backend — variáveis de ambiente

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com os valores reais:

```env
PORT=3000

# Obrigatório. Gere com: openssl rand -hex 64
JWT_SECRET=cole_aqui_uma_string_longa_e_aleatoria
JWT_EXPIRES_IN=1d

# Redis (padrão: localhost:6379)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Necessária apenas no processo do worker
OPENAI_API_KEY=sk-...
```

> O servidor não sobe se `JWT_SECRET` não estiver definida — isso é intencional.

### 3. Backend — API

```bash
cd backend
npm install
npm run dev
```

API disponível em `http://localhost:3000`. Ao subir pela primeira vez as tabelas são criadas automaticamente.

### 4. Backend — worker de transcrição

O worker é um **processo separado** da API. Sem ele rodando, aulas com vídeo ficam com `subtitle_status: "processing"` indefinidamente.

```bash
# em outro terminal, dentro de /backend
npm run dev:worker
```

### 5. Frontend

```bash
cd frontend-incluso/novo-frontend
cp .env.example .env.local
# edite .env.local: NEXT_PUBLIC_API_URL=http://localhost:3000
npm install
npm run dev
```

Frontend disponível em `http://localhost:3001` (ou a próxima porta disponível).

---

## Referência da API

Todas as rotas (exceto `/auth/*`) exigem o header:

```
Authorization: Bearer <token>
```

---

### Autenticação

#### `POST /auth/register`

Cria um novo usuário.

**Body:**
```json
{
  "name": "Maria",
  "email": "maria@example.com",
  "password": "minimo6"
}
```

**Resposta 201:**
```json
{ "message": "Usuário criado com sucesso", "userId": 1 }
```

---

#### `POST /auth/login`

Autentica um usuário e retorna o token JWT.

**Body:**
```json
{
  "email": "maria@example.com",
  "password": "minimo6"
}
```

**Resposta 200:**
```json
{
  "message": "Login realizado",
  "token": "eyJ...",
  "user": {
    "id": 1,
    "name": "Maria",
    "email": "maria@example.com"
  }
}
```

---

### Cursos

#### `GET /courses`

Retorna todos os cursos com o nome do criador.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "name": "Introdução à Programação",
    "description": "...",
    "start_date": "2026-01-01",
    "end_date": "2026-06-30",
    "creator_id": 1,
    "creator_name": "Maria"
  }
]
```

---

#### `GET /courses/:id`

Retorna um curso específico. Retorna 404 se não encontrado.

---

#### `POST /courses`

Cria um novo curso. O `creator_id` é lido do token JWT.

**Body:**
```json
{
  "name": "Introdução à Programação",
  "description": "Aprenda do zero",
  "start_date": "2026-01-01",
  "end_date": "2026-06-30"
}
```

**Resposta 201:**
```json
{ "message": "Curso criado", "courseId": 1 }
```

---

#### `PUT /courses/:id`

Atualiza um curso. Retorna 403 se o usuário não for o criador. Mesmos campos do POST.

---

#### `DELETE /courses/:id`

Deleta o curso **e todas as suas aulas**. Retorna 403 se o usuário não for o criador.

**Resposta 200:**
```json
{ "message": "Curso e suas aulas foram deletados" }
```

---

#### `GET /courses/:id/lessons`

Lista todas as aulas de um curso.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "title": "Variáveis e tipos",
    "status": "published",
    "video_url": "/uploads/videos/abc123.mp4",
    "subtitle_url": "/uploads/subtitles/lesson-1.vtt",
    "subtitle_status": "completed",
    "subtitle_error": null,
    "course_id": 1
  }
]
```

---

### Aulas

#### `POST /lessons`

Cria uma aula com upload de vídeo opcional.

Aceita `multipart/form-data` (com arquivo) ou `application/json` (sem arquivo):

| Campo | Tipo | Obrigatório |
|---|---|---|
| `title` | string (mín. 3 chars) | ✅ |
| `status` | `"draft"` ou `"published"` | ✅ |
| `course_id` | number | ✅ |
| `video` | arquivo (mp4/webm/mov/mkv, máx 500 MB) | ❌ |
| `video_url` | string (URL externa, fallback legado) | ❌ |

**Resposta 201:**
```json
{
  "message": "Lesson criada",
  "lessonId": 3,
  "subtitleStatus": "processing"
}
```

Se nenhum vídeo for enviado, `subtitleStatus` retorna `"none"`.

---

#### `PUT /lessons/:id`

Atualiza título, status e/ou `video_url` de uma aula. Retorna 403 se o usuário não for o criador do curso.

**Body:**
```json
{
  "title": "Novo título",
  "status": "published",
  "video_url": null
}
```

---

#### `DELETE /lessons/:id`

Deleta uma aula. Retorna 403 se o usuário não for o criador do curso.

---

#### `GET /lessons/:id/subtitle-status`

Retorna o status atual da legenda. Use para fazer polling após criar uma aula com vídeo.

**Resposta 200:**
```json
{
  "id": 3,
  "subtitle_status": "processing",
  "subtitle_url": null,
  "subtitle_error": null
}
```

Valores possíveis de `subtitle_status`:

| Valor | Significado |
|---|---|
| `none` | Nenhum vídeo foi enviado |
| `processing` | Worker está transcrevendo |
| `completed` | Legenda disponível em `subtitle_url` |
| `failed` | Falhou após 3 tentativas; detalhes em `subtitle_error` |

---

### Arquivos estáticos

Vídeos e legendas são servidos diretamente pela API:

```
GET /uploads/videos/<nome-do-arquivo>.mp4
GET /uploads/subtitles/lesson-<id>.vtt
```

Para usar a legenda num player de vídeo:

```html
<video controls>
  <source src="/uploads/videos/abc123.mp4" type="video/mp4" />
  <track kind="captions" src="/uploads/subtitles/lesson-3.vtt" srclang="pt" label="Português" default />
</video>
```

---

## Como funciona a pipeline de legendas

```
POST /lessons (com vídeo)
        │
        ▼
  Multer salva o arquivo em uploads/videos/
        │
        ▼
  LessonController cria a linha no banco
  (subtitle_status = 'processing')
        │
        ▼
  enqueueTranscriptionJob() — retorna imediatamente
  API responde 201 para o cliente
        │
        ▼ (processo separado)
  Worker BullMQ recebe o job
        │
        ▼
  whisperService.js — envia o vídeo para a API Whisper
  (limite: 25 MB; vídeos maiores → status 'failed')
        │
        ▼
  subtitleService.js — salva o .vtt em uploads/subtitles/
        │
        ▼
  lessonRepository.js — atualiza subtitle_status = 'completed'
  e subtitle_url = '/uploads/subtitles/lesson-N.vtt'
```

Em caso de erro, o BullMQ reprocessa o job até 3 vezes com backoff exponencial (5 s, 10 s, 20 s). Após todas as tentativas falharem, `subtitle_status` vira `"failed"` e a mensagem de erro é salva em `subtitle_error`.

---

## Modelo do banco

```sql
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL     -- bcrypt hash
);

CREATE TABLE courses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    start_date  TEXT    NOT NULL,
    end_date    TEXT    NOT NULL,
    creator_id  INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE lessons (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    status           TEXT    NOT NULL,           -- 'draft' | 'published'
    video_url        TEXT,
    subtitle_url     TEXT,
    subtitle_status  TEXT    NOT NULL DEFAULT 'none',
    subtitle_error   TEXT,
    course_id        INTEGER NOT NULL REFERENCES courses(id)
);
```

> O banco é criado automaticamente na primeira execução. Bancos de versões anteriores (sem as colunas de legenda) são migrados em runtime via `ALTER TABLE`.

---

## Melhorias planejadas

- Migrar de SQLite para PostgreSQL (SQLite tem limitações de escrita concorrente)
- Adicionar `PRAGMA foreign_keys = ON` e `ON DELETE CASCADE` para reforçar integridade referencial no banco
- Rate limiting em `/auth/login` e `/auth/register` (proteção contra força bruta)
- Headers de segurança HTTP com `helmet`
- Restringir origens permitidas no CORS
- Busca de cursos por nome
- Testes automatizados
- Conectar o frontend ao backend real (hoje usa dados mockados)