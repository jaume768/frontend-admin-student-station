import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = ({ toggleMobileSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const dropdownRef = useRef(null);

  // Actualizar el título de la página según la ruta actual
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setPageTitle('Dashboard');
    } else if (path.includes('/usuarios')) {
      setPageTitle('Gestión de Usuarios');
    } else if (path.includes('/ofertas-educativas')) {
      setPageTitle('Ofertas Educativas');
    } else if (path.includes('/ofertas')) {
      setPageTitle('Ofertas de Empleo');
    } else if (path.includes('/posts')) {
      setPageTitle('Publicaciones');
    } else if (path.includes('/escuelas')) {
      setPageTitle('Escuelas');
    } else if (path.includes('/configuracion')) {
      setPageTitle('Configuración');
    }
  }, [location]);

  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="toggle-sidebar" onClick={toggleMobileSidebar}>
          <FaBars />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      
      <div className="navbar-right">
        <div className="user-dropdown" ref={dropdownRef}>
          <div onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            {currentUser?.profile?.profilePicture ? (
              <img 
                src={currentUser.profile.profilePicture} 
                alt="Avatar" 
                className="user-avatar"
              />
            ) : (
              <FaUserCircle style={{ fontSize: '36px', color: '#64748b' }} />
            )}
          </div>
          
          <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
            <div className="dropdown-item">
              <div style={{ padding: '5px 10px', fontSize: '14px' }}>
                <div style={{ fontWeight: 'bold' }}>{currentUser?.fullName || currentUser?.username}</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>{currentUser?.email}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', margin: '5px 0' }}></div>
            <a href="/configuracion" className="dropdown-item">
              <FaCog className="dropdown-item-icon" />
              <span>Configuración</span>
            </a>
            <div onClick={handleLogout} className="dropdown-item">
              <FaSignOutAlt className="dropdown-item-icon" />
              <span>Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
