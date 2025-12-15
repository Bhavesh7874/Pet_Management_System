import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getPets } from '../../services/pets.service';
import PetCard from '../../shared/components/PetCard';
import Pagination from '../../shared/components/Pagination';
import FilterPanel from './components/FilterPanel';
import { Search, SlidersHorizontal, ArrowRight, Heart } from 'lucide-react';

const Home = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        species: '',
        breed: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchPets = async () => {
        try {
            const query = { ...filters, pageNumber, keyword };
            const data = await getPets(query);
            setPets(data.pets);
            setPages(data.pages);
            setPage(data.page);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [pageNumber, keyword]); // depend only on page/keyword trigger or explicit filter apply

    const handleSearch = (e) => {
        e.preventDefault();
        setPageNumber(1);
    };

    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const handleApplyFilters = () => {
        setPageNumber(1);
        fetchPets();
        setIsFilterOpen(false);
    };



    // Re-implement clear properly
    const realHandleClear = async () => {
        const emptyFilters = { category: '', species: '', breed: '', minPrice: '', maxPrice: '' };
        setFilters(emptyFilters);
        setPageNumber(1);

        // Manual fetch with empty filters
        try {
            const data = await getPets({ pageNumber: 1, keyword });
            setPets(data.pets);
            setPages(data.pages);
            setPage(data.page);
        } catch (e) { console.error(e); }
        setIsFilterOpen(false);
    };

    return (
        <div>
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="hero">
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find your new <br />
                            <span style={{ color: 'var(--primary)' }}>best friend</span>
                        </h1>
                        <p className="hero-text">
                            Browse through our list of lovely pets waiting for a home. Adopt, don't shop!
                        </p>

                        <form onSubmit={handleSearch} className="hero-search">
                            <Search className="search-icon" size={24} />
                            <input
                                type="text"
                                placeholder="Search by breed or name..."
                                className="search-input"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>
                    </div>
                    {/* Decorative Image/Pattern could go here */}
                    <div className="hero-image" style={{ position: 'absolute', right: 0, bottom: '-2rem', opacity: 0.1, pointerEvents: 'none' }}>
                    </div>
                </div>
            </div>

            {/* Pet Grid */}
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2 className="text-2xl font-bold" style={{ fontSize: '1.875rem' }}>Available Pets</h2>
                <button className="btn btn-secondary" style={{ gap: '0.5rem' }} onClick={() => setIsFilterOpen(true)}>
                    <SlidersHorizontal size={20} />
                    Filters
                </button>
            </div>

            <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={realHandleClear}
                onClose={() => setIsFilterOpen(false)}
                isOpen={isFilterOpen}
            />

            {loading ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {pets.map((pet) => (
                        <div key={pet._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
                            <div style={{ position: 'relative', height: '14rem', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <img
                                    src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                    alt={pet.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: 'var(--text-primary)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        {pet.status}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    {pet.name}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    {pet.species} • {pet.breed}
                                </p>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {pet.description}
                                </p>

                                <a href={`/pets/${pet._id}`} className="btn btn-outline w-full" style={{ marginTop: 'auto', textAlign: 'center' }}>
                                    View Details
                                </a>
                            </div>
                        </div>
                    ))}
                    {pets.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No pets found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {!loading && (
                <Pagination
                    page={page}
                    pages={pages}
                    onPageChange={(page) => setPageNumber(page)}
                />
            )}
        </div>
    );
};

export default Home;
