import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBookingsForBroker, updateBookingStatus } from '../../api/bookings';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import './Broker.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

const statusBadge = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected' };
const statusLabel = { pending: '⏳ Pending', accepted: '✅ Accepted', rejected: '❌ Rejected' };

const BookingRequestsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookingsForBroker(user.id);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (bookingId, status, customerName) => {
    setUpdating(bookingId);
    try {
      const updated = await updateBookingStatus(bookingId, status);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      showToast(
        `${status === 'accepted' ? '✅ Accepted' : '❌ Rejected'} booking from ${customerName}`,
        status === 'accepted' ? 'success' : 'error'
      );
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    accepted: bookings.filter((b) => b.status === 'accepted').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="broker-page">
      <Navbar />
      <div className="page-container">
        <div className="page-header broker-page-header">
          <div>
            <h1 className="page-title">Booking Requests</h1>
            <p className="page-subtitle">Review and manage customer booking requests for your properties</p>
          </div>
          <div className="broker-stats-row">
            <div className="broker-stat pending-stat">{counts.pending} Pending</div>
            <div className="broker-stat accepted-stat">{counts.accepted} Accepted</div>
            <div className="broker-stat rejected-stat">{counts.rejected} Rejected</div>
          </div>
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
            <div className="empty-state-icon">📭</div>
            <h3>{filter === 'all' ? 'No booking requests yet' : `No ${filter} requests`}</h3>
            <p>
              {filter === 'all'
                ? 'Booking requests from customers will appear here once they show interest in your properties.'
                : `You have no ${filter} requests.`}
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {filtered.map((booking) => (
              <div key={booking.id} className={`request-card card${booking.status !== 'pending' ? ' actioned' : ''}`}>
                <div className="request-customer">
                  <div className="request-avatar">{booking.customerName?.[0]?.toUpperCase()}</div>
                  <div className="request-customer-info">
                    <div className="request-customer-name">{booking.customerName}</div>
                    <div className="request-customer-email">✉️ {booking.customerEmail}</div>
                    <div className="request-date">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="request-divider" />

                <div className="request-property">
                  <div className="request-label">Property</div>
                  <div className="request-property-name">{booking.propertyTitle}</div>
                  <div className="request-property-location">📍 {booking.propertyLocation}</div>
                  <div className="request-property-price">{formatPrice(booking.propertyPrice)}</div>
                </div>

                <div className="request-actions-col">
                  <span className={`badge ${statusBadge[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                  {booking.status === 'pending' && (
                    <div className="request-action-btns">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatus(booking.id, 'accepted', booking.customerName)}
                        disabled={updating === booking.id}
                      >
                        {updating === booking.id ? '...' : '✓ Accept'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatus(booking.id, 'rejected', booking.customerName)}
                        disabled={updating === booking.id}
                      >
                        {updating === booking.id ? '...' : '✗ Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default BookingRequestsPage;
