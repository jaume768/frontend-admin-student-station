import api from './api';

export const getSchools = async (filters = {}) => {
  const { page = 1, limit = 10, search, country } = filters;
  let url = `/api/admin/schools?page=${page}&limit=${limit}`;
  
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (country) url += `&country=${country}`;
  
  const response = await api.get(url);
  return response.data;
};
