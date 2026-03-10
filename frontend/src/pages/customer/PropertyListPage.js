import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProperties } from '../../api/properties';
import { createBooking, getBookingsForCustomer } from '../../api/bookings';
import { getFavorites, addFavorite, removeFavorite } from '../../api/favorites';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import './Customer.css';

const PropertyListPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [favorites, setFavorites] = useState([]); // array of propertyId numbers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('browse'); // 'browse' | 'favorites'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load properties first (public, no auth)
      const props = await getAllProperties();
      setProperties(props);
    } catch (err) {
      setError('Could not load properties: ' + err.message);
    }
    try {
      const bookings = await getBookingsForCustomer();
      setMyBookings(bookings);
    } catch (err) {
      setError('Could not load bookings: ' + err.message + '. Please log out and log back in.');
    }
    try {
      const favs = await getFavorites();
      setFavorites(favs.map(f => f.propertyId));
    } catch (err) {
      // non-critical, silently fail favorites
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getBookingStatus = (propertyId) => {
    const b = myBookings.find((b) => b.propertyId === propertyId);
    return b ? b.status : null;
  };

  const handleBook = async (property) => {
    try {
      await createBooking({ propertyId: property.id });
      showToast(`Booking request sent for "${property.title}"!`);
      const updated = await getBookingsForCustomer();
      setMyBookings(updated);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleFavorite = async (propertyId) => {
    const isFaved = favorites.includes(propertyId);
    // Optimistic update
    setFavorites(prev =>
      isFaved ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
    try {
      if (isFaved) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
        showToast('Added to favorites ❤️');
      }
    } catch (err) {
      // Revert on error
      setFavorites(prev =>
        isFaved ? [...prev, propertyId] : prev.filter(id => id !== propertyId)
      );
      showToast(err.message, 'error');
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  const displayed = tab === 'favorites' ? favoriteProperties : filtered;

  return (
    <div className="customer-page">
      <Navbar />
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 24px', textAlign: 'center', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}
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
            <div className="stat-chip">{favorites.length} ❤️ Saved</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            className={`filter-tab${tab === 'browse' ? ' active' : ''}`}
            onClick={() => setTab('browse')}
          >
            🏠 Browse All
          </button>
          <button
            className={`filter-tab${tab === 'favorites' ? ' active' : ''}`}
            onClick={() => setTab('favorites')}
          >
            ❤️ My Favorites
            <span className="filter-count">{favorites.length}</span>
          </button>
        </div>

        {tab === 'browse' && (
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
        )}

        {loading ? (
          <Loader />
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{tab === 'favorites' ? '💔' : '🏚'}</div>
            <h3>{tab === 'favorites' ? 'No saved properties' : 'No properties found'}</h3>
            <p>
              {tab === 'favorites'
                ? 'Heart a property while browsing to save it here.'
                : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div className="grid-3 properties-grid">
            {displayed.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBook={handleBook}
                bookingStatus={getBookingStatus(property.id)}
                isFavorited={favorites.includes(property.id)}
                onFavorite={handleFavorite}
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
