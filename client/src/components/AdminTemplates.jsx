import { useState, useEffect } from 'react';

const LABELS = {
  admin_order: 'Admin Notification',
  customer_order: 'Customer Confirmation',
};

const VARS_HINT = 'Available variables: {{order_id}} {{customer_name}} {{customer_email}} {{customer_phone}} {{total}} {{date}} {{items}}';

export default function AdminTemplates({ token, onLogout }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // template name being edited
  const [form, setForm] = useState({ subject: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch('/api/admin/templates', { headers })
      .then((r) => {
        if (r.status === 401) { onLogout(); return null; }
        return r.json();
      })
      .then((data) => { if (Array.isArray(data)) { setTemplates(data); } setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function startEdit(tpl) {
    setEditing(tpl.name);
    setForm({ subject: tpl.subject, body: tpl.body });
    setError('');
    setSaved(false);
  }

  function cancel() {
    setEditing(null);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/templates/${editing}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        setSaving(false);
        return;
      }
      const updated = await res.json();
      setTemplates((prev) => prev.map((t) => (t.name === editing ? updated : t)));
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Connection error');
    }
    setSaving(false);
  }

  if (loading) return <div className="loading">Loading templates...</div>;

  if (editing) {
    const label = LABELS[editing] || editing;
    return (
      <div className="admin-form-container">
        <h2>Edit Template: {label}</h2>
        <p className="vars-hint">{VARS_HINT}</p>
        <form onSubmit={handleSave} className="admin-form">
          <label>
            Subject
            <input
              className="admin-input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </label>
          <label>
            Body
            <textarea
              className="admin-input admin-textarea"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={14}
              required
            />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn-secondary" onClick={cancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-plants">
      <div className="admin-section-header">
        <h2>Email Templates</h2>
        {saved && <span className="save-confirmation">Saved!</span>}
      </div>
      <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.9rem' }}>{VARS_HINT}</p>
      {templates.map((tpl) => (
        <div key={tpl.name} className="template-card">
          <div className="template-card-header">
            <h3>{LABELS[tpl.name] || tpl.name}</h3>
            <button className="btn-secondary" onClick={() => startEdit(tpl)}>Edit</button>
          </div>
          <p className="template-subject"><strong>Subject:</strong> {tpl.subject}</p>
          <pre className="template-body">{tpl.body}</pre>
        </div>
      ))}
    </div>
  );
}
