import React from 'react';
import { FaChartBar, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import '../../styles/StatsComponents.css';

const GrowthStats = ({ stats }) => {
  if (!stats || !stats.usuarios) {
    return null;
  }

  return (
    <div className="stats-section growth-stats">
      <h2 className="section-title">
        <FaChartBar className="section-icon" />
        Crecimiento y Tendencias
      </h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <FaUserCheck className="stat-icon" />
            <h3>Perfiles Completos</h3>
          </div>
          <div className="stat-value">{stats.usuarios.tasaPerfilesCompletos}%</div>
          <div className="stat-description">
            Porcentaje de usuarios con perfil completo
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <FaUserPlus className="stat-icon" />
            <h3>Nuevos Usuarios</h3>
          </div>
          <div className="stat-value">{stats.usuarios.nuevos30Dias}</div>
          <div className="stat-description">
            Usuarios registrados en los últimos 30 días
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthStats;
