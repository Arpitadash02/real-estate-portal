import apiClient from './apiClient';

// GET /api/properties?search=&type=&minPrice=&maxPrice=&sortBy=&sortDir=
export const getAllProperties = (filters = {}) => {
  const params = {};
  if (filters.search)   params.search   = filters.search;
  if (filters.type)     params.type     = filters.type;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sortBy)   params.sortBy   = filters.sortBy;
  if (filters.sortDir)  params.sortDir  = filters.sortDir;
  return apiClient.get('/properties', { params }).then(res => res.data);
};

// GET /api/properties/broker  (broker's own listings)
export const getPropertiesByBroker = () =>
  apiClient.get('/properties/broker').then(res => res.data);

// POST /api/properties
export const addProperty = (property) =>
  apiClient.post('/properties', property).then(res => res.data);

// DELETE /api/properties/{id}
export const deleteProperty = (id) =>
  apiClient.delete(`/properties/${id}`);
