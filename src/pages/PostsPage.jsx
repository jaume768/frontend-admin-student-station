import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import '../styles/PostsPage.css';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    creator: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.creator) queryParams.append('creator', filters.creator);
      
      const response = await api.get(`/api/admin/posts?${queryParams.toString()}`);
      
      if (response.data.success) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Error al cargar las publicaciones');
      }
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      setError('Error al cargar las publicaciones. Inténtalo de nuevo más tarde.');
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
    fetchPosts();
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
      creator: ''
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (loading && posts.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ha ocurrido un error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchPosts} 
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Función para truncar texto largo
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Gestión de Publicaciones</h1>
      </div>

      <div className="posts-controls">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Buscar por título, contenido..." 
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
              <option value="published">Publicados</option>
              <option value="draft">Borrador</option>
              <option value="archived">Archivados</option>
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

      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-image">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt={post.title} />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{truncateText(post.content)}</p>
                <div className="post-meta">
                  <div className="post-author">
                    <span className="meta-label">Autor:</span>
                    <span className="meta-value">{post.creator?.username || 'Desconocido'}</span>
                  </div>
                  <div className="post-date">
                    <span className="meta-label">Fecha:</span>
                    <span className="meta-value">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className="post-actions">
                  <button className="action-btn view-btn" title="Ver publicación">
                    <FaEye />
                  </button>
                  <button className="action-btn edit-btn" title="Editar">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" title="Eliminar">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No se encontraron publicaciones con los filtros aplicados.</p>
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

export default PostsPage;
