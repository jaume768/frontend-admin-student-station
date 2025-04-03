import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBlogPost, getBlogPostDetails, updateBlogPost } from '../services/blogService';
import { toast } from 'react-toastify';
import '../styles/BlogPostFormPage.css';

const BlogPostFormPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!postId;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: null,
    imagePreview: '',
    category: 'fashion',
    author: '',
    featured: false,
    size: 'medium-blog',
    tags: '',
    status: 'published'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (isEditing) {
      fetchPostDetails();
    }
  }, [postId]);
  
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await getBlogPostDetails(postId);
      
      if (response.success) {
        const blogPost = response.blogPost;
        setFormData({
          title: blogPost.title || '',
          content: blogPost.content || '',
          excerpt: blogPost.excerpt || '',
          image: null, // No cargar el archivo, solo mostrar la vista previa
          imagePreview: blogPost.image || '',
          category: blogPost.category || 'fashion',
          author: blogPost.author || '',
          featured: blogPost.featured || false,
          size: blogPost.size || 'medium-blog',
          tags: blogPost.tags ? blogPost.tags.join(', ') : '',
          status: blogPost.status || 'published'
        });
      }
    } catch (error) {
      console.error('Error al cargar detalles del post:', error);
      toast.error('Error al cargar los detalles del post');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar errores al cambiar el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
      // Limpiar error si existe
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'El extracto es obligatorio';
    }
    
    if (!formData.imagePreview && !formData.image) {
      newErrors.image = 'La imagen es obligatoria';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'El autor es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Preparar datos para enviar
      const postDataToSubmit = {
        ...formData,
        // Enviar solo el archivo de imagen, o la URL si no hay archivo nuevo
        image: formData.image || formData.imagePreview
      };
      
      let response;
      if (isEditing) {
        response = await updateBlogPost(postId, postDataToSubmit);
        if (response.success) {
          toast.success('Post actualizado correctamente');
        }
      } else {
        response = await createBlogPost(postDataToSubmit);
        if (response.success) {
          toast.success('Post creado correctamente');
        }
      }
      
      // Redirigir a la página de gestión del blog
      navigate('/blog');
    } catch (error) {
      console.error('Error al guardar el post:', error);
      toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el post`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/blog');
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando detalles del post...</p>
      </div>
    );
  }
  
  return (
    <div className="blog-post-form-page">
      <div className="page-header">
        <h1>{isEditing ? 'Editar Post' : 'Crear Nuevo Post'}</h1>
      </div>
      
      <form className="blog-post-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column main-column">
            <div className={`form-group-blog ${errors.title ? 'has-error' : ''}`}>
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título del post"
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className={`form-group-blog ${errors.excerpt ? 'has-error' : ''}`}>
              <label htmlFor="excerpt">Extracto</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Breve resumen del post (se mostrará en las vistas previas)"
                rows="3"
              />
              {errors.excerpt && <div className="error-message">{errors.excerpt}</div>}
            </div>
            
            <div className={`form-group-blog ${errors.content ? 'has-error' : ''}`}>
              <label htmlFor="content">Contenido</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Contenido completo del post"
                rows="15"
              />
              {errors.content && <div className="error-message">{errors.content}</div>}
            </div>
            
            <div className="form-group-blog">
              <label htmlFor="tags">Etiquetas</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Etiquetas separadas por comas"
              />
              <div className="field-hint">Ejemplo: moda, tendencias, verano</div>
            </div>
          </div>
          
          <div className="form-column side-column">
            <div className={`form-group-blog image-upload-group ${errors.image ? 'has-error' : ''}`}>
              <label>Imagen Principal</label>
              <div className="image-preview-container">
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Vista previa" 
                    className="image-preview" 
                  />
                ) : (
                  <div className="no-image-placeholder">Sin imagen</div>
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-input-label">
                Seleccionar Imagen
              </label>
              {errors.image && <div className="error-message">{errors.image}</div>}
            </div>
            
            <div className={`form-group-blog ${errors.author ? 'has-error' : ''}`}>
              <label htmlFor="author">Autor</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Nombre del autor"
              />
              {errors.author && <div className="error-message">{errors.author}</div>}
            </div>
            
            <div className="form-group-blog">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="fashion">Moda</option>
                <option value="designers">Diseñadores</option>
                <option value="industry">Industria</option>
                <option value="education">Educación</option>
                <option value="events">Eventos</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div className="form-group-blog">
              <label htmlFor="size">Tamaño del Post</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="small-blog">Pequeño</option>
                <option value="medium-blog">Mediano</option>
                <option value="large-blog">Grande</option>
              </select>
              <div className="field-hint">Afecta a cómo se muestra en la página del blog</div>
            </div>
            
            <div className="form-group-blog">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            
            <div className="form-group-blog checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Destacar este post</span>
              </label>
              <div className="field-hint">Los posts destacados aparecen en posiciones prominentes</div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : isEditing ? 'Actualizar Post' : 'Crear Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostFormPage;
