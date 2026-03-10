import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBookingsForCustomer } from '../../api/bookings';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import './Customer.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

const statusLabel = { pending: '⏳ Pending', accepted: '✅ Accepted', rejected: '❌ Rejected' };
const statusBadge = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected' };

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookingsForCustomer(user.id);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    accepted: bookings.filter((b) => b.status === 'accepted').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
  };

  return (
    <div className="customer-page">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track the status of all your property booking requests</p>
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</h3>
            <p>
              {filter === 'all'
                ? 'Browse properties and submit a booking request to get started.'
                : `You have no ${filter} booking requests.`}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map((booking) => (
              <div key={booking.id} className="booking-row card">
                <div className="booking-info">
                  <div className="booking-property-name">{booking.propertyTitle}</div>
                  <div className="booking-location">📍 {booking.propertyLocation}</div>
                  <div className="booking-price">{formatPrice(booking.propertyPrice)}</div>
                  <div className="booking-date">
                    Requested: {new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="booking-status-col">
                  <span className={`badge ${statusBadge[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                  {booking.status === 'accepted' && (
                    <p className="booking-note success-note">🎉 Congratulations! Your booking has been accepted by the broker. You will be contacted soon.</p>
                  )}
                  {booking.status === 'rejected' && (
                    <p className="booking-note rejected-note">The broker has declined this request. You may book another property.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
