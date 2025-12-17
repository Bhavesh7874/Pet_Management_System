import { useState, useEffect, useCallback } from 'react';

import { getPets } from '../../services/pets.service';
import PetCard from '../../shared/components/PetCard';
import Pagination from '../../shared/components/Pagination';
import FilterPanel from './components/FilterPanel';
import { Search, SlidersHorizontal } from 'lucide-react';

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

    const fetchPets = useCallback(async () => {
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
    }, [filters, pageNumber, keyword]);

    useEffect(() => {
        fetchPets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="hero">
                <div className="container h-full flex items-center relative">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find your new <br />
                            <span className="hero-span-primary">best friend</span>
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
                    <div className="hero-image-decorative">
                    </div>
                </div>
            </div>

            {/* Pet Grid */}
            <div className="section-header">
                <h2 className="text-3xl font-bold">Available Pets</h2>
                <button className="btn btn-secondary gap-2" onClick={() => setIsFilterOpen(true)}>
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
                    {pets.map((pet, index) => (
                        <PetCard key={pet._id} pet={pet} index={index} />
                    ))}
                    {pets.length === 0 && (
                        <div className="empty-results">
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
