'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminCharitiesPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '', is_featured: false });

  const loadCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('name');
    setCharities(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) loadCharities();
  }, [authLoading]);

  const resetForm = () => {
    setFormData({ name: '', description: '', image_url: '', is_featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('charities').update(formData).eq('id', editing.id);
    } else {
      await supabase.from('charities').insert(formData);
    }
    resetForm();
    await loadCharities();
  };

  const handleEdit = (charity) => {
    setEditing(charity);
    setFormData({
      name: charity.name,
      description: charity.description || '',
      image_url: charity.image_url || '',
      is_featured: charity.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this charity? Users linked to it will have their charity unset.')) return;
    await supabase.from('charities').delete().eq('id', id);
    await loadCharities();
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>💚 <span className="gradient-text">Charity Management</span></h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Add, edit, and manage charity organizations</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Charity
        </button>
      </div>

      {/* Charities Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {charities.map((charity) => (
          <div key={charity.id} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{charity.name}</h3>
              {charity.is_featured && (
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>⭐ Featured</span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.6' }}>
              {charity.description?.substring(0, 120)}...
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleEdit(charity)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => handleDelete(charity.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charity Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
              {editing ? 'Edit Charity' : 'Add New Charity'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Charity Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Featured charity</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editing ? 'Update' : 'Add'} Charity
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
