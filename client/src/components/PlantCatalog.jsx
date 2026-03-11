import { useState, useEffect } from 'react';
import PlantCard from './PlantCard';

export default function PlantCatalog() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSun, setFilterSun] = useState('');
  const [filterMoisture, setFilterMoisture] = useState('');
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

  const types = [...new Set(plants.map((p) => p.type).filter(Boolean))].sort();
  const sunOptions = [...new Set(plants.map((p) => p.sun_requirements).filter(Boolean))].sort();
  const moistureOptions = [...new Set(plants.map((p) => p.moisture_requirements).filter(Boolean))].sort();

  const filtered = plants.filter((p) => {
    if (search && !p.common_name.toLowerCase().includes(search.toLowerCase()) && !p.plant_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && p.type !== filterType) return false;
    if (filterSun && p.sun_requirements !== filterSun) return false;
    if (filterMoisture && p.moisture_requirements !== filterMoisture) return false;
    return true;
  });

  const hasFilters = search || filterType || filterSun || filterMoisture;

  function clearFilters() {
    setSearch('');
    setFilterType('');
    setFilterSun('');
    setFilterMoisture('');
  }

  if (loading) {
    return <div className="loading">Loading plants...</div>;
  }

  return (
    <div className="catalog">
      <div className="catalog-header">
        <h1>Plant Catalog</h1>
        <p className="catalog-subtitle">Browse our selection of native plants</p>
        <div className="catalog-filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterSun} onChange={(e) => setFilterSun(e.target.value)} className="filter-select">
            <option value="">All Sun</option>
            {sunOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterMoisture} onChange={(e) => setFilterMoisture(e.target.value)} className="filter-select">
            <option value="">All Moisture</option>
            {moistureOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {hasFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="no-results">No plants found{hasFilters ? ' matching your filters' : ''}</p>
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
