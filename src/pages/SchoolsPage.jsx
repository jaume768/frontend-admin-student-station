import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaEye, FaTrash, FaGraduationCap } from 'react-icons/fa';
import { getSchools } from '../services/schoolService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/SchoolsPage.css';

const SchoolsPage = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    country: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, [currentPage, filters]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      
      const response = await getSchools({
        page: currentPage,
        limit: 10,
        search: filters.search,
        country: filters.country
      });
      
      if (response.success) {
        setSchools(response.schools);
        setTotalPages(response.pagination.pages);
      } else {
        setError('Error al cargar las escuelas');
      }
    } catch (error) {
      console.error('Error al obtener escuelas:', error);
      setError('Error al cargar las escuelas. Inténtalo de nuevo más tarde.');
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
    fetchSchools();
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
      search: '',
      country: ''
    });
    setCurrentPage(1);
  };

  const handleViewSchool = (schoolId) => {
    // Navegar a la vista detallada de la escuela
    navigate(`/escuelas/${schoolId}`);
  };

  const handleViewPrograms = (schoolId, schoolName) => {
    // Navegar a la vista de programas de la escuela
    toast.info(`Viendo programas de ${schoolName}`);
    navigate(`/ofertas-educativas?institution=${schoolId}`);
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

  if (loading && schools.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando escuelas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ha ocurrido un error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchSchools} 
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="schools-container">
      <div className="schools-header">
        <h1>Gestión de Escuelas</h1>
      </div>

      <div className="schools-controls">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Buscar por nombre, ubicación..." 
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
            <label htmlFor="country">País</label>
            <select 
              id="country"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="España">España</option>
              <option value="Francia">Francia</option>
              <option value="Italia">Italia</option>
              <option value="Reino Unido">Reino Unido</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Alemania">Alemania</option>
              <option value="Suiza">Suiza</option>
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

      {schools.length > 0 ? (
        <div className="schools-grid">
          {schools.map(school => (
            <div key={school._id} className="school-card">
              <div className="school-image">
                {school.logo ? (
                  <img src={school.logo} alt={school.name} />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="school-content">
                <h3 className="school-name">{school.name}</h3>
                
                <div className="school-details">
                  <div className="school-detail">
                    <span className="detail-label">Ubicación:</span>
                    <span className="detail-value">
                      {school.city ? `${school.city}, ` : ''}{school.country || 'No especificado'}
                    </span>
                  </div>
                  
                  <div className="school-detail">
                    <span className="detail-label">Sitio web:</span>
                    <span className="detail-value">
                      {school.website ? (
                        <a href={school.website} target="_blank" rel="noopener noreferrer">
                          {school.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      ) : (
                        'No disponible'
                      )}
                    </span>
                  </div>
                  
                  <div className="school-detail">
                    <span className="detail-label">Programas:</span>
                    <span className="detail-value">
                      {school.programCount || 0} programas
                    </span>
                  </div>
                </div>
                
                <div className="school-actions">
                  <button 
                    className="action-btn view-btn" 
                    title="Ver detalles"
                    onClick={() => handleViewSchool(school._id)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn programs-btn" 
                    title="Ver programas educativos"
                    onClick={() => handleViewPrograms(school._id, school.name)}
                  >
                    <FaGraduationCap />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No se encontraron escuelas con los filtros aplicados.</p>
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

export default SchoolsPage;
