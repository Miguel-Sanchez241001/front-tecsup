// In-memory store — mirrors the Java Spring Boot backend contract exactly.
// Data persists while the serverless function stays warm; resets on cold start.
let usuarios = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@tecsup.edu.pe',
    contrasena: '123456',
    telefono: '999111222',
    activo: true,
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'García',
    email: 'maria@tecsup.edu.pe',
    contrasena: '123456',
    telefono: '999333444',
    activo: false,
  },
];
let nextId = 3;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const uid = id !== undefined ? parseInt(id, 10) : null;

  // ── /api/usuarios/:id ────────────────────────────────────────────────────
  if (uid !== null) {
    const idx = usuarios.findIndex((u) => u.id === uid);

    if (req.method === 'GET') {
      if (idx === -1)
        return res.status(404).json(`No se encontro un usuario con el id: ${uid}`);
      return res.status(200).json(usuarios[idx]);
    }

    if (req.method === 'PUT') {
      if (idx === -1)
        return res.status(400).json(`No se encontro un usuario con el id: ${uid}`);
      const { nombre, apellido, email, contrasena, telefono, activo } = req.body ?? {};
      if (!nombre || !apellido || !email || !contrasena)
        return res.status(400).json('Campos requeridos: nombre, apellido, email, contrasena');
      usuarios[idx] = {
        id: uid,
        nombre,
        apellido,
        email,
        contrasena,
        telefono: telefono ?? '',
        activo: activo ?? true,
      };
      return res.status(200).json('Usuario actualizado correctamente.');
    }

    if (req.method === 'DELETE') {
      if (idx === -1)
        return res.status(400).json(`No se encontro un usuario con el id: ${uid}`);
      usuarios.splice(idx, 1);
      return res.status(200).json('Usuario eliminado correctamente.');
    }

    return res.status(405).end();
  }

  // ── /api/usuarios ────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    return res.status(200).json(usuarios);
  }

  if (req.method === 'POST') {
    const { nombre, apellido, email, contrasena, telefono, activo } = req.body ?? {};
    if (!nombre || !apellido || !email || !contrasena)
      return res
        .status(400)
        .json('Campos requeridos: nombre, apellido, email, contrasena');
    const nuevo = {
      id: nextId++,
      nombre,
      apellido,
      email,
      contrasena,
      telefono: telefono ?? '',
      activo: activo ?? true,
    };
    usuarios.push(nuevo);
    return res.status(201).json('Usuario registrado correctamente.');
  }

  return res.status(405).end();
}
