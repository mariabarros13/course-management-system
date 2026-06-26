const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  return apiCall(`/lessons?courseId=${courseId}`, 'GET', undefined, token);
}

export async function getLessonById(id: string, token?: string) {
  return apiCall(`/lessons/${id}`, 'GET', undefined, token);
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

export async function register(email: string, password: string) {
  return apiCall('/auth/register', 'POST', { email, password });
}

export async function login(email: string, password: string) {
  return apiCall('/auth/login', 'POST', { email, password });
}
