import { useState, useEffect } from 'react';

const EMPTY = {
  nombre: '',
  apellido: '',
  email: '',
  contrasena: '',
  telefono: '',
  activo: true,
};

function UsuarioForm({ usuario, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      usuario
        ? {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            contrasena: usuario.contrasena,
            telefono: usuario.telefono || '',
            activo: usuario.activo,
          }
        : EMPTY,
    );
    setErrors({});
  }, [usuario]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Campo requerido';
    if (!form.apellido.trim()) e.apellido = 'Campo requerido';
    if (!form.email.trim()) e.email = 'Campo requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.contrasena.trim()) e.contrasena = 'Campo requerido';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            autoComplete="off"
          />
          {errors.nombre && <span className="field-error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input
            id="apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Ingrese el apellido"
            autoComplete="off"
          />
          {errors.apellido && <span className="field-error">{errors.apellido}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          autoComplete="off"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="contrasena">Contraseña *</label>
        <input
          id="contrasena"
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
        {errors.contrasena && <span className="field-error">{errors.contrasena}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="999 000 000"
        />
      </div>

      <div className="form-group form-check">
        <label htmlFor="activo">
          <input
            id="activo"
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
          <span>Usuario activo</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : usuario ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

export default UsuarioForm;
