import { useState, useEffect } from 'react';
import PlantCard from './PlantCard';

export default function PlantCatalog() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plants')
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = plants.filter(
    (p) =>
      p.common_name.toLowerCase().includes(search.toLowerCase()) ||
      p.plant_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading plants...</div>;
  }

  return (
    <div className="catalog">
      <div className="catalog-header">
        <h1>Plant Catalog</h1>
        <p className="catalog-subtitle">Browse our selection of native plants</p>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="no-results">No plants found matching "{search}"</p>
      ) : (
        <div className="plant-grid">
          {filtered.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}
