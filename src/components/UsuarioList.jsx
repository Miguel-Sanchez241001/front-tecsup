function UsuarioList({ usuarios, onEdit, onDelete }) {
  if (usuarios.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="cell-id">{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.telefono || '—'}</td>
              <td>
                <span className={`badge ${u.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="cell-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(u)}
                  title="Editar usuario"
                >
                  Editar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(u.id)}
                  title="Eliminar usuario"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsuarioList;
