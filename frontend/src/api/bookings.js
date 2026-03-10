import apiClient from './apiClient';

// POST /api/bookings
export const createBooking = ({ propertyId }) =>
  apiClient.post('/bookings', { propertyId }).then(res => res.data);

// GET /api/bookings/customer
export const getBookingsForCustomer = () =>
  apiClient.get('/bookings/customer').then(res => res.data);

// GET /api/bookings/broker
export const getBookingsForBroker = () =>
  apiClient.get('/bookings/broker').then(res => res.data);

// PATCH /api/bookings/{id}/status
export const updateBookingStatus = (bookingId, status) =>
  apiClient.patch(`/bookings/${bookingId}/status`, { status }).then(res => res.data);
