import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { getAllMagazines, deleteMagazine } from '../services/magazineService';
import '../styles/MagazinesPage.css';

const MagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'active' // active, inactive, all
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState(null);

  // Cargar revistas
  const fetchMagazines = async () => {
    try {
      setLoading(true);
      const { magazines, pagination } = await getAllMagazines(
        filters.page || 1,
        filters.limit || 10,
        filters.search,
        filters.status
      );
      setMagazines(magazines);
      setPagination(pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar las revistas. Por favor, intente de nuevo.');
      console.error('Error fetching magazines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, [pagination.page, filters.status]);

  // Aplicar filtros
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchMagazines();
    setShowFilters(false);
  };

  // Eliminar revista
  const handleDeleteMagazine = async () => {
    if (!selectedMagazine) return;
    
    try {
      setIsDeleting(true);
      await deleteMagazine(selectedMagazine._id);
      fetchMagazines();
      setSelectedMagazine(null);
    } catch (err) {
      setError('Error al eliminar la revista. Por favor, intente de nuevo.');
      console.error('Error deleting magazine:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="admin-page magazines-page">
      <div className="page-header">
        <h1>Revistas</h1>
        <Link to="/revistas/nueva" className="btn btn-primary">
          <FaPlus /> Nueva Revista
        </Link>
      </div>

      {/* Barra de filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters(e)}
          />
          <button className="search-button" onClick={handleApplyFilters}>
            <FaSearch />
          </button>
        </div>

        <button
          className="filter-toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filtros
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="filters-panel">
          <form onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label htmlFor="status">Estado:</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
                <option value="all">Todas</option>
              </select>
            </div>

            <div className="filters-actions">
              <button type="submit" className="btn btn-primary">
                Aplicar Filtros
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFilters(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mensaje de error */}
      {error && <div className="error-message">{error}</div>}

      {/* Tabla de revistas */}
      {loading ? (
        <div className="loading-indicator">Cargando revistas...</div>
      ) : magazines.length === 0 ? (
        <div className="empty-state">
          <p>No hay revistas disponibles</p>
          <Link to="/revistas/nueva" className="btn btn-primary">
            <FaPlus /> Crear Nueva Revista
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {magazines.map((magazine) => (
                <tr key={magazine._id}>
                  <td>
                    <div className="thumbnail">
                      <img src={magazine.image} alt={magazine.name} />
                    </div>
                  </td>
                  <td>{magazine.name}</td>
                  <td>{formatPrice(magazine.price)}</td>
                  <td>
                    <span className={`status-badge ${magazine.isActive ? 'active' : 'inactive'}`}>
                      {magazine.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{new Date(magazine.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <Link to={`/revistas/${magazine._id}`} className="btn-icon" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/revistas/editar/${magazine._id}`} className="btn-icon edit" title="Editar">
                      <FaEdit />
                    </Link>
                    <button
                      className="btn-icon delete"
                      title="Eliminar"
                      onClick={() => setSelectedMagazine(magazine)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                className="pagination-btn"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {selectedMagazine && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Está seguro que desea eliminar la revista <strong>{selectedMagazine.name}</strong>?</p>
              <p className="warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedMagazine(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteMagazine}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazinesPage;
