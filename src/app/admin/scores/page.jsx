'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminScoresPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editScore, setEditScore] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name');
      setUsers(data || []);
      setLoading(false);
    }
    if (!authLoading) loadUsers();
  }, [authLoading]);

  const loadUserScores = async (userId) => {
    setScoresLoading(true);
    setError('');
    setSuccess('');
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    setScores(data || []);
    setScoresLoading(false);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditScore(null);
    loadUserScores(user.id);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const scoreVal = parseInt(editScore.score);
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      setError('Score must be between 1 and 45');
      return;
    }
    if (!editScore.date) {
      setError('Date is required');
      return;
    }

    const { error: updateErr } = await supabase
      .from('scores')
      .update({ score: scoreVal, date: editScore.date })
      .eq('id', editScore.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess('Score updated successfully!');
      setEditScore(null);
      await loadUserScores(selectedUser.id);
    }
  };

  const handleDelete = async (scoreId) => {
    if (!confirm('Delete this score?')) return;
    setError('');
    await supabase.from('scores').delete().eq('id', scoreId);
    setSuccess('Score deleted');
    await loadUserScores(selectedUser.id);
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
        <h1>⛳ <span className="gradient-text">Score Management</span></h1>
        <p>View and edit scores for all users</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 350px) 1fr', gap: '24px' }}>
        {/* User List Sidebar */}
        <div>
          <input
            type="text"
            className="form-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '70vh', overflowY: 'auto' }}>
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => handleSelectUser(u)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: selectedUser?.id === u.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${selectedUser?.id === u.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{u.name}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{u.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scores Panel */}
        <div>
          {!selectedUser ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👈</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Select a User</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Choose a user from the list to view and edit their scores.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                  Scores for <span className="gradient-text">{selectedUser.name}</span>
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{selectedUser.email} · {scores.length} of 5 scores</p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {scoresLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div className="spinner" />
                </div>
              ) : scores.length === 0 ? (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>This user has no scores recorded.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {scores.map((s) => (
                    <div key={s.id} className="glass-card" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1rem',
                          }}>
                            {s.score}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Stableford Score</div>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                              📅 {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            onClick={() => setEditScore({ ...s, score: s.score.toString() })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger"
                            style={{ padding: '6px 14px' }}
                            onClick={() => handleDelete(s.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Score Modal */}
      {editScore && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditScore(null); }}>
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Edit Score</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Stableford Score (1-45)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="45"
                  value={editScore.score}
                  onChange={(e) => setEditScore(prev => ({ ...prev, score: e.target.value }))}
                  required
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Date Played</label>
                <input
                  type="date"
                  className="form-input"
                  value={editScore.date}
                  onChange={(e) => setEditScore(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Update Score
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditScore(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: minmax(250px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
