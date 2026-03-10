import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProperties } from '../../api/properties';
import { createBooking, getBookingsForCustomer } from '../../api/bookings';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import './Customer.css';

const PropertyListPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [props, bookings] = await Promise.all([
        getAllProperties(),
        getBookingsForCustomer(user.id),
      ]);
      setProperties(props);
      setMyBookings(bookings);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const getBookingStatus = (propertyId) => {
    const b = myBookings.find((b) => b.propertyId === propertyId);
    return b ? b.status : null;
  };

  const handleBook = async (property) => {
    try {
      await createBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        brokerId: property.brokerId,
      });
      showToast(`Booking request sent for "${property.title}"!`);
      const updated = await getBookingsForCustomer(user.id);
      setMyBookings(updated);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">
      <Navbar />
      <div className="page-container">
        <div className="page-header customer-page-header">
          <div>
            <h1 className="page-title">Discover Properties</h1>
            <p className="page-subtitle">Find your perfect home from our curated luxury listings</p>
          </div>
          <div className="stats-row">
            <div className="stat-chip">{properties.length} Listings</div>
            <div className="stat-chip">{myBookings.filter(b => b.status === 'pending').length} Pending</div>
            <div className="stat-chip success">{myBookings.filter(b => b.status === 'accepted').length} Accepted</div>
          </div>
        </div>

        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name, location, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏚</div>
            <h3>No properties found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="grid-3 properties-grid">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBook={handleBook}
                bookingStatus={getBookingStatus(property.id)}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default PropertyListPage;
