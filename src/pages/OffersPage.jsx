import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { getOffers, deleteOffer } from '../services/offerService';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/OffersPage.css';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    publisher: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, [currentPage, filters]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.publisher) queryParams.append('publisher', filters.publisher);
      
      const response = await getOffers({
        page: currentPage,
        limit: 10,
        status: filters.status,
        search: filters.search,
        publisher: filters.publisher
      });
      
      if (response.success) {
        setOffers(response.offers);
        setTotalPages(response.pagination.pages);
      } else {
        setError('Error al cargar las ofertas');
      }
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      setError('Error al cargar las ofertas. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOffers();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      search: '',
      publisher: ''
    });
    setCurrentPage(1);
  };

  const handleDeleteOffer = (offerId, offerName) => {
    setConfirmAction({
      type: 'delete',
      id: offerId,
      name: offerName,
      onConfirm: async () => {
        try {
          await deleteOffer(offerId);
          toast.success('Oferta eliminada correctamente');
          fetchOffers();
        } catch (error) {
          console.error('Error al eliminar oferta:', error);
          toast.error('Error al eliminar la oferta');
        } finally {
          setConfirmAction(null);
        }
      },
      onCancel: () => setConfirmAction(null)
    });
  };

  const handleViewOffer = (offerId) => {
    // Aquí podría implementarse una vista detallada en una modal o
    // redirigir a una página de detalles
    window.open(`https://plataformaestudiantesmoda.com/ofertas/${offerId}`, '_blank');
  };

  const handleEditOffer = (offerId) => {
    // Navegar a la página de edición de la oferta
    navigate(`/ofertas/${offerId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    let className = 'status-badge ';
    
    switch (status) {
      case 'activa':
        className += 'active';
        break;
      case 'inactiva':
        className += 'inactive';
        break;
      case 'pendiente':
        className += 'pending';
        break;
      case 'pausada':
        className += 'paused';
        break;
      default:
        className += 'default';
    }
    
    return (
      <span className={className}>
        {status === 'activa' ? 'Activa' : 
         status === 'inactiva' ? 'Inactiva' : 
         status === 'pendiente' ? 'Pendiente' : 
         status === 'pausada' ? 'Pausada' : 'Desconocido'}
      </span>
    );
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button 
          onClick={() => changePage(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Anterior
        </button>
        
        <div className="pagination-info">
          Página {currentPage} de {totalPages}
        </div>
        
        <button 
          onClick={() => changePage(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Siguiente
        </button>
      </div>
    );
  };

  const renderConfirmDialog = () => {
    if (!confirmAction) return null;

    const title = 'Eliminar oferta';
    const message = `¿Estás seguro de que deseas eliminar la oferta "${confirmAction.name}"? Esta acción no se puede deshacer.`;

    return (
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog">
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="confirm-actions">
            <button 
              className="btn btn-outline" 
              onClick={confirmAction.onCancel}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-danger" 
              onClick={confirmAction.onConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && offers.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ha ocurrido un error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchOffers} 
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="offers-container">
      {renderConfirmDialog()}
      <div className="offers-header">
        <h1>Gestión de Ofertas de Empleo</h1>
      </div>

      <div className="offers-controls">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Buscar por título, empresa..." 
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </div>
        </form>
        
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
        >
          <FaFilter /> Filtros
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="status">Estado</label>
            <select 
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="activa">Activas</option>
              <option value="inactiva">Inactivas</option>
              <option value="pendiente">Pendientes</option>
              <option value="pausada">Pausadas</option>
            </select>
          </div>
          
          <button 
            onClick={resetFilters}
            className="btn btn-outline reset-filters-btn"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {offers.length > 0 ? (
        <div className="table-responsive">
          <table className="offers-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Empresa</th>
                <th>Publicada</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer._id}>
                  <td>
                    <div className="offer-title-cell">
                      <span className="offer-title">{offer.position}</span>
                      {offer.isUrgent && <span className="urgent-badge">Urgente</span>}
                    </div>
                  </td>
                  <td>{offer.companyName}</td>
                  <td>{formatDate(offer.publicationDate)}</td>
                  <td>{offer.city}</td>
                  <td>{getStatusBadge(offer.status)}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view-btn" 
                      title="Ver oferta"
                      onClick={() => handleViewOffer(offer._id)}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      title="Editar"
                      onClick={() => handleEditOffer(offer._id)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                      onClick={() => handleDeleteOffer(offer._id, offer.position)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-results">
          <p>No se encontraron ofertas con los filtros aplicados.</p>
          <button 
            onClick={resetFilters} 
            className="btn btn-outline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default OffersPage;
