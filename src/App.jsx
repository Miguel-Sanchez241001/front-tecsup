import { useState, useEffect, useCallback } from 'react';
import UsuarioList from './components/UsuarioList.jsx';
import UsuarioForm from './components/UsuarioForm.jsx';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from './services/api.js';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsuarios(await getUsuarios());
    } catch {
      setError('No se pudo cargar la lista de usuarios. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (u) => { setEditTarget(u); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const handleCreate = async (data) => {
    try {
      await createUsuario(data);
      await load();
      closeForm();
      notify('Usuario registrado correctamente.');
    } catch (e) {
      notify(e.message || 'Error al registrar usuario.', 'error');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateUsuario(editTarget.id, data);
      await load();
      closeForm();
      notify('Usuario actualizado correctamente.');
    } catch (e) {
      notify(e.message || 'Error al actualizar usuario.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    try {
      await deleteUsuario(id);
      await load();
      notify('Usuario eliminado correctamente.');
    } catch (e) {
      notify(e.message || 'Error al eliminar usuario.', 'error');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1 className="header-title">Gestión de Usuarios</h1>
            <p className="header-sub">Sistema CRUD · Tecsup</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <h2 className="section-title">
            Usuarios
            {!loading && (
              <span className="count-badge">{usuarios.length}</span>
            )}
          </h2>
          <button className="btn btn-primary" onClick={openCreate}>
            + Nuevo Usuario
          </button>
        </div>

        {toast && (
          <div className={`toast toast-${toast.type}`} role="alert">
            {toast.msg}
          </div>
        )}

        {loading && (
          <div className="status-box">
            <div className="spinner" />
            <span>Cargando usuarios...</span>
          </div>
        )}

        {!loading && error && (
          <div className="status-box error-box">
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={load}>Reintentar</button>
          </div>
        )}

        {!loading && !error && (
          <UsuarioList
            usuarios={usuarios}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showForm && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeForm}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editTarget ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                className="btn-close"
                onClick={closeForm}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <UsuarioForm
              usuario={editTarget}
              onSubmit={editTarget ? handleUpdate : handleCreate}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
