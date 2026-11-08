import { CreateNoteInput, Note, UpdateNoteInput } from '../types/note';
import { clearAppData } from '../utils/cleanup';
import { mockApi } from './mockApi';

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

let onUnauthorizedHandler: ((isLockedSession: boolean) => void) | null = null;

export function setUnauthorizedHandler(fn: (isLockedSession: boolean) => void) {
  onUnauthorizedHandler = fn;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    const isLocked = data.message === 'Locked';
    if (!isLocked) clearAppData();
    if (onUnauthorizedHandler) onUnauthorizedHandler(isLocked);
    throw new Error(data.message || 'Unauthorized');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getNotes(): Promise<Note[]> {
  if (USE_MOCK_API) return mockApi.getNotes();
  return fetchJson<Note[]>('/notes');
}

export async function createNote(data: CreateNoteInput): Promise<Note> {
  if (USE_MOCK_API) return mockApi.createNote(data);
  return fetchJson<Note>('/notes', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateNote(id: string, data: UpdateNoteInput): Promise<Note> {
  if (USE_MOCK_API) return mockApi.updateNote(id, data);
  return fetchJson<Note>(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteNote(id: string): Promise<{ success: boolean; id: string }> {
  if (USE_MOCK_API) return mockApi.deleteNote(id);
  return fetchJson<{ success: boolean; id: string }>(`/notes/${id}`, { method: 'DELETE' });
}
