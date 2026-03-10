import apiClient from './apiClient';

// GET /api/favorites  – customer's saved properties
export const getFavorites = () =>
  apiClient.get('/favorites').then(res => res.data);

// POST /api/favorites/{propertyId}  – add to favorites
export const addFavorite = (propertyId) =>
  apiClient.post(`/favorites/${propertyId}`).then(res => res.data);

// DELETE /api/favorites/{propertyId}  – remove from favorites
export const removeFavorite = (propertyId) =>
  apiClient.delete(`/favorites/${propertyId}`);
