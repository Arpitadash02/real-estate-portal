import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPropertiesByBroker, addProperty, deleteProperty } from '../../api/properties';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import './Broker.css';

const EMPTY_FORM = { title: '', location: '', price: '', bedrooms: '', bathrooms: '', area: '', description: '', image: '', type: 'Apartment' };
const TYPES = ['Apartment', 'Villa', 'Penthouse', 'Loft', 'Chalet', 'Townhouse', 'Studio', 'Duplex'];

const BrokerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPropertiesByBroker(user.id);
      setProperties(data);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setFormError('');
    const { title, location, price, bedrooms, bathrooms, area, description, type } = form;
    if (!title || !location || !price || !bedrooms || !bathrooms || !area || !description) {
      setFormError('Please fill in all required fields.'); return;
    }
    setSubmitting(true);
    try {
      await addProperty({
        ...form,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        brokerId: user.id,
        brokerEmail: user.email,
        image: form.image || `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80`,
        type,
      });
      showToast(`"${title}" added successfully!`);
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property listing?')) return;
    await deleteProperty(id);
    showToast('Property deleted.', 'error');
    setProperties((ps) => ps.filter((p) => p.id !== id));
  };

  return (
    <div className="broker-page">
      <Navbar />
      <div className="page-container">
        <div className="page-header broker-page-header">
          <div>
            <h1 className="page-title">My Listings</h1>
            <p className="page-subtitle">Manage your property portfolio</p>
          </div>
          <div className="broker-header-actions">
            <div className="stat-chip-broker">{properties.length} Properties Listed</div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              ＋ Add Property
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h3>No listings yet</h3>
            <p>Add your first property to start receiving booking requests from customers.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Property</button>
          </div>
        ) : (
          <div className="grid-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Property</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProperty} className="add-property-form">
              {formError && <div className="alert alert-error">{formError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input name="title" className="form-input" placeholder="e.g. Skyline Penthouse" value={form.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input" value={form.type} onChange={handleChange}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input name="location" className="form-input" placeholder="e.g. Manhattan, New York" value={form.location} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (USD) *</label>
                  <input name="price" type="number" className="form-input" placeholder="e.g. 1500000" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Area (sq ft) *</label>
                  <input name="area" type="number" className="form-input" placeholder="e.g. 2000" value={form.area} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bedrooms *</label>
                  <input name="bedrooms" type="number" className="form-input" placeholder="3" value={form.bedrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bathrooms *</label>
                  <input name="bathrooms" type="number" className="form-input" placeholder="2" value={form.bathrooms} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-input" placeholder="Describe the property..." value={form.description} onChange={handleChange} rows={3} />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (optional)</label>
                <input name="image" className="form-input" placeholder="https://..." value={form.image} onChange={handleChange} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '🗑'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default BrokerDashboard;
