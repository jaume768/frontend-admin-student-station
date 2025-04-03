import api from './api';

export const getBlogPosts = async (filters = {}) => {
  const { page = 1, limit = 10, status, category, featured, search } = filters;
  let url = `/api/admin/blog?page=${page}&limit=${limit}`;
  
  if (status) url += `&status=${status}`;
  if (category) url += `&category=${category}`;
  if (featured !== undefined) url += `&featured=${featured}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  
  const response = await api.get(url);
  return response.data;
};

export const getBlogPostDetails = async (postId) => {
  const response = await api.get(`/api/admin/blog/${postId}`);
  return response.data;
};

export const createBlogPost = async (postData) => {
  // Se debe usar FormData para enviar imágenes
  const formData = new FormData();
  
  // Añadir todos los campos de texto
  Object.keys(postData).forEach(key => {
    if (key !== 'image' || (key === 'image' && typeof postData[key] === 'string')) {
      formData.append(key, postData[key]);
    }
  });
  
  // Añadir la imagen si es un archivo
  if (postData.image instanceof File) {
    formData.append('image', postData.image);
  }
  
  const response = await api.post('/api/admin/blog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const updateBlogPost = async (postId, postData) => {
  // Se debe usar FormData para enviar imágenes
  const formData = new FormData();
  
  // Añadir todos los campos de texto
  Object.keys(postData).forEach(key => {
    if (key !== 'image' || (key === 'image' && typeof postData[key] === 'string')) {
      formData.append(key, postData[key]);
    }
  });
  
  // Añadir la imagen si es un archivo
  if (postData.image instanceof File) {
    formData.append('image', postData.image);
  }
  
  const response = await api.put(`/api/admin/blog/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const deleteBlogPost = async (postId) => {
  const response = await api.delete(`/api/admin/blog/${postId}`);
  return response.data;
};

export const updateBlogPostStatus = async (postId, status) => {
  const response = await api.put(`/api/admin/blog/${postId}/status`, { status });
  return response.data;
};
