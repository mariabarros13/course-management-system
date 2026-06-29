// IMPORTANTE: o backend (server.js) monta as rotas em /auth, /courses e
// /lessons direto na raiz — NÃO existe prefixo /api. Usar "/api" aqui
// causa 404 em toda chamada (foi exatamente o bug do login/registro).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getCourses(token?: string) {
  return apiCall('/courses', 'GET', undefined, token);
}

export async function getCourseById(id: string, token?: string) {
  return apiCall(`/courses/${id}`, 'GET', undefined, token);
}

export async function createCourse(data: any, token?: string) {
  return apiCall('/courses', 'POST', data, token);
}

export async function updateCourse(id: string, data: any, token?: string) {
  return apiCall(`/courses/${id}`, 'PUT', data, token);
}

export async function deleteCourse(id: string, token?: string) {
  return apiCall(`/courses/${id}`, 'DELETE', undefined, token);
}

export async function getLessons(courseId: string, token?: string) {
  // Não existe rota "/lessons?courseId=...". O backend só expõe a lista de
  // aulas de um curso de forma aninhada, em LessonController.indexByCourse.
  return apiCall(`/courses/${courseId}/lessons`, 'GET', undefined, token);
}

// O backend NÃO tem uma rota "GET /lessons/:id" para buscar uma única aula
// isolada (veja src/routes/lessonRoutes.js — só tem POST /, PUT /:id,
// DELETE /:id e GET /:id/subtitle-status). Se for preciso o detalhe de uma
// aula, hoje a única forma é buscar a lista do curso (getLessons) e filtrar
// pelo id no cliente, ou adicionar essa rota no backend.
export async function getLessonById(courseId: string, lessonId: string, token?: string) {
  const lessons = await getLessons(courseId, token);
  const lesson = Array.isArray(lessons) ? lessons.find((l: any) => String(l.id) === String(lessonId)) : null;
  if (!lesson) throw new Error('Aula não encontrada');
  return lesson;
}

export async function createLesson(data: any, token?: string) {
  return apiCall('/lessons', 'POST', data, token);
}

export async function updateLesson(id: string, data: any, token?: string) {
  return apiCall(`/lessons/${id}`, 'PUT', data, token);
}

export async function deleteLesson(id: string, token?: string) {
  return apiCall(`/lessons/${id}`, 'DELETE', undefined, token);
}

export async function getSubtitleStatus(lessonId: string, token?: string) {
  return apiCall(`/lessons/${lessonId}/subtitle-status`, 'GET', undefined, token);
}

export async function register(name: string, email: string, password: string) {
  // O backend exige "name" além de email/senha (AuthController.register) —
  // sem isso ele responde 400 "Todos os campos são obrigatórios".
  return apiCall('/auth/register', 'POST', { name, email, password });
}

export async function login(email: string, password: string) {
  return apiCall('/auth/login', 'POST', { email, password });
}
