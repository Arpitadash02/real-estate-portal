import React from 'react';
import './PropertyCard.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

const PropertyCard = ({ property, onBook, onDelete, bookingStatus }) => {
  const { title, location, price, bedrooms, bathrooms, area, description, image, type } = property;

  const getBookBtnLabel = () => {
    if (!bookingStatus) return 'Book Now';
    if (bookingStatus === 'pending') return '⏳ Request Sent';
    if (bookingStatus === 'accepted') return '✅ Accepted';
    if (bookingStatus === 'rejected') return '❌ Try Again';
    return 'Book Now';
  };

  const isBooked = bookingStatus === 'pending' || bookingStatus === 'accepted';

  return (
    <div className="property-card card">
      <div className="property-image-wrap">
        <img src={image} alt={title} className="property-image" />
        <span className="property-type-badge">{type}</span>
      </div>
      <div className="property-body">
        <div className="property-header">
          <h3 className="property-title">{title}</h3>
          <span className="property-price">{formatPrice(price)}</span>
        </div>
        <p className="property-location">📍 {location}</p>
        <p className="property-desc">{description}</p>
        <div className="property-meta">
          <span>🛏 {bedrooms} Beds</span>
          <span>🚿 {bathrooms} Baths</span>
          <span>📐 {area?.toLocaleString()} sq ft</span>
        </div>
        <div className="property-actions">
          {onBook && (
            <button
              className={`btn btn-primary btn-sm property-book-btn${isBooked ? ' booked' : ''}`}
              onClick={() => onBook(property)}
              disabled={isBooked}
            >
              {getBookBtnLabel()}
            </button>
          )}
          {onDelete && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(property.id)}>
              🗑 Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
