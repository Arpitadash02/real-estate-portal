// Mock Bookings API using localStorage

const BOOKINGS_KEY = 'rp_bookings';

const getBookings = () =>
  JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');

const saveBookings = (bookings) =>
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

export const createBooking = ({ propertyId, propertyTitle, propertyLocation, propertyPrice, customerId, customerName, customerEmail, brokerId }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookings = getBookings();
      const alreadyBooked = bookings.find(
        (b) => b.propertyId === propertyId && b.customerId === customerId && b.status !== 'rejected'
      );
      if (alreadyBooked) {
        reject(new Error('You have already booked this property.'));
        return;
      }
      const newBooking = {
        id: `booking-${Date.now()}`,
        propertyId,
        propertyTitle,
        propertyLocation,
        propertyPrice,
        customerId,
        customerName,
        customerEmail,
        brokerId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      saveBookings([...bookings, newBooking]);
      resolve(newBooking);
    }, 400);
  });
};

export const getBookingsForCustomer = (customerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getBookings().filter((b) => b.customerId === customerId));
    }, 300);
  });
};

export const getBookingsForBroker = (brokerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getBookings().filter((b) => b.brokerId === brokerId));
    }, 300);
  });
};

export const updateBookingStatus = (bookingId, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = getBookings().map((b) =>
        b.id === bookingId ? { ...b, status } : b
      );
      saveBookings(updated);
      resolve(updated.find((b) => b.id === bookingId));
    }, 300);
  });
};
