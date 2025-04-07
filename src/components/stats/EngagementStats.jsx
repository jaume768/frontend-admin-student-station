import React from 'react';
import { FaChartLine, FaUsers, FaBriefcase, FaCheck } from 'react-icons/fa';
import '../../styles/StatsComponents.css';

const EngagementStats = ({ stats }) => {
  if (!stats || !stats.ofertas) {
    return null;
  }

  return (
    <div className="stats-section engagement-stats">
      <h2 className="section-title">
        <FaChartLine className="section-icon" />
        Estadísticas de Engagement
      </h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <FaBriefcase className="stat-icon" />
            <h3>Tasa de Aplicación</h3>
          </div>
          <div className="stat-value">{stats.ofertas.tasaAplicacion}%</div>
          <div className="stat-description">
            Porcentaje de ofertas que reciben al menos una aplicación
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <FaUsers className="stat-icon" />
            <h3>Aplicaciones por Oferta</h3>
          </div>
          <div className="stat-value">{stats.ofertas.promedioAplicaciones}</div>
          <div className="stat-description">
            Promedio de candidatos por oferta de trabajo
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <FaCheck className="stat-icon" />
            <h3>Tasa de Conversión</h3>
          </div>
          <div className="stat-value">{stats.ofertas.tasaConversion}%</div>
          <div className="stat-description">
            Porcentaje de aplicaciones aceptadas
          </div>
        </div>
      </div>

      {stats.posts && stats.posts.masPopulares && stats.posts.masPopulares.length > 0 && (
        <div className="popular-posts-section">
          <h3>Publicaciones Más Populares</h3>
          <div className="popular-posts-list">
            {stats.posts.masPopulares.map((post, index) => (
              <div className="popular-post-card" key={post._id}>
                <div className="post-rank">{index + 1}</div>
                <div className="post-image">
                  {post.mainImage ? (
                    <img src={post.mainImage} alt={post.title} />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                </div>
                <div className="post-info">
                  <h4>{post.title}</h4>
                  <p>Guardados: {post.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementStats;
