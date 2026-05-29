const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
  return data;
}

export const getUsuarios = () => request('/usuarios');

export const getUsuario = (id) => request(`/usuarios/${id}`);

export const createUsuario = (body) =>
  request('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const updateUsuario = (id, body) =>
  request(`/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const deleteUsuario = (id) =>
  request(`/usuarios/${id}`, { method: 'DELETE' });
