import { X } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters, onClearFilters, onClose, isOpen }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div className="filter-panel" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '300px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.5rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Filters</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <X size={24} />
                </button>
            </div>

            {/* Category */}
            <div className="form-group">
                <label className="label">Category</label>
                <select name="category" value={filters.category} onChange={handleChange} className="select">
                    <option value="">All</option>
                    <option value="adoption">Adoption</option>
                    <option value="sale">For Sale</option>
                </select>
            </div>

            {/* Species */}
            <div className="form-group">
                <label className="label">Species</label>
                <input
                    type="text"
                    name="species"
                    placeholder="e.g. Dog, Cat"
                    value={filters.species}
                    onChange={handleChange}
                    className="input"
                />
            </div>
            <div className="form-group">
                <label className="label">Breed</label>
                <input
                    type="text"
                    name="breed"
                    placeholder="e.g. Bulldog"
                    value={filters.breed}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={onApplyFilters} className="btn btn-primary w-full">Apply Filters</button>
                <button onClick={onClearFilters} className="btn btn-outline w-full">Clear All</button>
            </div>
        </div>
    );
};

export default FilterPanel;
