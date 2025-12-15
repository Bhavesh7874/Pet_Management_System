import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
    return (pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '0.5rem' }}>
            <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <ChevronLeft size={20} />
            </button>

            {[...Array(pages).keys()].map(x => (
                <button
                    key={x + 1}
                    className={`btn ${x + 1 === page ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => onPageChange(x + 1)}
                    style={{
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: x + 1 === page ? 'var(--primary)' : 'transparent',
                        color: x + 1 === page ? 'white' : 'var(--text-primary)',
                        borderColor: x + 1 === page ? 'var(--primary)' : 'var(--border)'
                    }}
                >
                    {x + 1}
                </button>
            ))}

            <button
                className="btn btn-outline"
                disabled={page === pages}
                onClick={() => onPageChange(page + 1)}
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    ));
};

export default Pagination;
