'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*, charities(name)')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) loadUsers();
  }, [authLoading]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('users').update({
      name: editUser.name,
      subscription_status: editUser.subscription_status,
      subscription_type: editUser.subscription_type,
      role: editUser.role,
    }).eq('id', editUser.id);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setEditUser(null);
      await loadUsers();
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>👥 <span className="gradient-text">User Management</span></h1>
        <p>View and manage all registered users</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Subscription</th>
              <th>Type</th>
              <th>Charity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: '600' }}>{u.name}</td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-pending' : 'badge-active'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${u.subscription_status}`}>
                    {u.subscription_status}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  {u.subscription_type || '—'}
                </td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  {u.charities?.name || '—'}
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => setEditUser({ ...u })}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditUser(null); }}>
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editUser.name}
                  onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={editUser.role}
                  onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Subscription Status</label>
                <select
                  className="form-input"
                  value={editUser.subscription_status}
                  onChange={(e) => setEditUser(prev => ({ ...prev, subscription_status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lapsed">Lapsed</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Subscription Type</label>
                <select
                  className="form-input"
                  value={editUser.subscription_type || ''}
                  onChange={(e) => setEditUser(prev => ({ ...prev, subscription_type: e.target.value }))}
                >
                  <option value="">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
                <button type="button" className="btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
