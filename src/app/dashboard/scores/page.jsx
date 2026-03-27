'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function ScoresPage() {
  const { user, profile, supabase, loading: authLoading } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [formData, setFormData] = useState({ score: '', date: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setScores(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) loadScores();
  }, [user, authLoading]);

  const resetForm = () => {
    setFormData({ score: '', date: '' });
    setEditingScore(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('[ScoresPage] submit', { user, profile, formData, editingScore });

    if (!user?.id) {
      setError('Unable to add score: user session not found. Please refresh and sign in again.');
      return;
    }

    if (profile?.subscription_status !== 'active') {
      setError('Active subscription required to add scores.');
      return;
    }

    const scoreVal = parseInt(formData.score, 10);
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      setError('Score must be between 1 and 45 (Stableford format)');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }

    const parsedDate = new Date(formData.date);
    if (Number.isNaN(parsedDate.getTime())) {
      setError('Date is invalid');
      return;
    }
    const normalizedDate = parsedDate.toISOString().slice(0, 10); // YYYY-MM-DD

    if (editingScore) {
      // Update
      const { error: updateErr } = await supabase
        .from('scores')
        .update({ score: scoreVal, date: normalizedDate })
        .eq('id', editingScore.id);
      if (updateErr) {
        setError(updateErr.message);
        return;
      }
      setSuccess('Score updated!');
    } else {
      // Insert new — enforce rolling 5
      if (scores.length >= 5) {
        // Delete oldest score (by date)
        const sorted = [...scores].sort((a, b) => new Date(a.date) - new Date(b.date));
        const oldest = sorted[0];
        await supabase.from('scores').delete().eq('id', oldest.id);
      }

      const { error: insertErr } = await supabase
        .from('scores')
        .insert({ user_id: user.id, score: scoreVal, date: normalizedDate });
      if (insertErr) {
        setError(insertErr.message);
        return;
      }
      setSuccess('Score added! ' + (scores.length >= 5 ? '(Oldest score was replaced)' : ''));
    }

    resetForm();
    await loadScores();
  };

  const handleEdit = (score) => {
    setEditingScore(score);
    setFormData({ score: score.score.toString(), date: score.date });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (scoreId) => {
    if (!confirm('Are you sure you want to delete this score?')) return;
    await supabase.from('scores').delete().eq('id', scoreId);
    setSuccess('Score deleted');
    await loadScores();
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="section-header">
        <h1>⛳ <span className="gradient-text">My Scores</span></h1>
        <p>Track your Stableford scores. Your last 5 scores are your draw entries.</p>
      </div>

      {/* Subscription gate */}
      {profile?.subscription_status !== 'active' && (
        <div className="alert alert-info">
          🔒 You need an active subscription to add scores.
        </div>
      )}

      {success && <div className="alert alert-success">{success}</div>}

      {/* Score Count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          {scores.length} of 5 scores stored
          <div style={{
            width: '200px',
            height: '6px',
            background: 'var(--color-border)',
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(scores.length / 5) * 100}%`,
              height: '100%',
              background: 'var(--gradient-primary)',
              borderRadius: '3px',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ opacity: profile?.subscription_status === 'active' ? 1 : 0.5, cursor: profile?.subscription_status === 'active' ? 'pointer' : 'not-allowed' }}
          onClick={() => {
            if (profile?.subscription_status !== 'active') {
              setError('Active subscription required to add scores.');
              return;
            }
            setShowForm(true);
            setEditingScore(null);
            setFormData({ score: '', date: '' });
          }}
          disabled={profile?.subscription_status !== 'active'}
        >
          + Add Score
        </button>
      </div>

      {/* Score Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
              {editingScore ? 'Edit Score' : 'Add New Score'}
            </h3>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" htmlFor="score-value">Stableford Score (1-45)</label>
                <input
                  id="score-value"
                  type="number"
                  className="form-input"
                  placeholder="Enter your score"
                  min="1"
                  max="45"
                  value={formData.score}
                  onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="score-date">Date Played</label>
                <input
                  id="score-date"
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              {!editingScore && scores.length >= 5 && (
                <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                  ⚠️ You already have 5 scores. Adding this will replace your oldest score.
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingScore ? 'Update Score' : 'Add Score'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scores List */}
      {scores.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⛳</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>No Scores Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Add your first Stableford score to start entering draws!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scores.map((s, i) => (
            <div key={s.id} className="glass-card" style={{
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                }}>
                  {s.score}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Stableford Score</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    📅 {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(s)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="btn-danger" style={{ padding: '6px 14px' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
