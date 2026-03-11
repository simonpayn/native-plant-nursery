import { useState, useEffect } from 'react';

const emptyPlant = { plant_name: '', common_name: '', availability_date: '', container_size: '4-inch pot', price: '', description: '', sun_requirements: '', moisture_requirements: '', type: '', image_url: '' };

export default function AdminPlants({ token }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, 'new' = add form, id = edit form
  const [form, setForm] = useState(emptyPlant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => { fetchPlants(); }, []);

  function fetchPlants() {
    fetch('/api/admin/plants', { headers })
      .then((r) => r.json())
      .then((data) => { setPlants(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function startAdd() {
    setForm(emptyPlant);
    setEditing('new');
    setError('');
  }

  function startEdit(plant) {
    setForm({ ...plant });
    setEditing(plant.id);
    setError('');
  }

  function cancel() {
    setEditing(null);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const isNew = editing === 'new';
    const url = isNew ? '/api/admin/plants' : `/api/admin/plants/${editing}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        setSaving(false);
        return;
      }
      setEditing(null);
      fetchPlants();
    } catch {
      setError('Connection error');
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this plant?')) return;
    await fetch(`/api/admin/plants/${id}`, { method: 'DELETE', headers });
    fetchPlants();
  }

  if (loading) return <div className="loading">Loading plants...</div>;

  if (editing !== null) {
    return (
      <div className="admin-form-container">
        <h2>{editing === 'new' ? 'Add Plant' : 'Edit Plant'}</h2>
        <form onSubmit={handleSave} className="admin-form">
          <label>
            Scientific Name
            <input className="admin-input" value={form.plant_name} onChange={(e) => setForm({ ...form, plant_name: e.target.value })} required />
          </label>
          <label>
            Common Name
            <input className="admin-input" value={form.common_name} onChange={(e) => setForm({ ...form, common_name: e.target.value })} required />
          </label>
          <label>
            Availability Date
            <input className="admin-input" type="date" value={form.availability_date} onChange={(e) => setForm({ ...form, availability_date: e.target.value })} required />
          </label>
          <label>
            Container Size
            <select className="admin-input" value={form.container_size} onChange={(e) => setForm({ ...form, container_size: e.target.value })}>
              <option>4-inch pot</option>
              <option>1 gallon</option>
              <option>2 gallon</option>
              <option>5 gallon</option>
            </select>
          </label>
          <label>
            Price ($)
            <input className="admin-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
          <label>
            Type
            <select className="admin-input" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">— None —</option>
              <option>Perennial</option>
              <option>Annual</option>
              <option>Grass</option>
              <option>Shrub</option>
              <option>Tree</option>
              <option>Vine</option>
            </select>
          </label>
          <label>
            Sun Requirements
            <select className="admin-input" value={form.sun_requirements || ''} onChange={(e) => setForm({ ...form, sun_requirements: e.target.value })}>
              <option value="">— None —</option>
              <option>Full Sun</option>
              <option>Part Shade</option>
              <option>Full Shade</option>
            </select>
          </label>
          <label>
            Moisture Requirements
            <select className="admin-input" value={form.moisture_requirements || ''} onChange={(e) => setForm({ ...form, moisture_requirements: e.target.value })}>
              <option value="">— None —</option>
              <option>Dry</option>
              <option>Medium</option>
              <option>Moist</option>
              <option>Wet</option>
            </select>
          </label>
          <label>
            Description
            <textarea className="admin-input admin-textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </label>
          <label>
            Image URL
            <input className="admin-input" type="url" placeholder="https://..." value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
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
        <h2>Manage Plants ({plants.length})</h2>
        <button className="submit-btn" style={{ width: 'auto' }} onClick={startAdd}>+ Add Plant</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Common Name</th>
              <th>Scientific Name</th>
              <th>Type</th>
              <th>Sun</th>
              <th>Moisture</th>
              <th>Size</th>
              <th>Available</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((p) => (
              <tr key={p.id}>
                <td>{p.common_name}</td>
                <td className="italic">{p.plant_name}</td>
                <td>{p.type || '—'}</td>
                <td>{p.sun_requirements || '—'}</td>
                <td>{p.moisture_requirements || '—'}</td>
                <td>{p.container_size}</td>
                <td>{p.availability_date}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td className="admin-actions-cell">
                  <button className="btn-secondary" onClick={() => startEdit(p)}>Edit</button>
                  <button className="remove-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
