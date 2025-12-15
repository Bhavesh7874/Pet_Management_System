import { useState, useEffect, useContext } from 'react';
import AuthContext from '../auth/AuthContext';
import StatusBadge from '../../shared/components/StatusBadge';
import { PawPrint, Calendar, Table as TableIcon, Grid } from 'lucide-react';
import { getUserApplications } from '../../services/applications.service';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        if (!user) return;

        const fetchApplications = async () => {
            try {
                const data = await getUserApplications();
                setApplications(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user]);


    if (authLoading || (!user && loading)) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;

    if (!user) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Please log in to view dashboard.</div>;
    }

    if (loading) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="container" style={{ maxWidth: '56rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="section-header" style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: 0 }}>My Adoption Applications</h1>

                {applications.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                background: viewMode === 'grid' ? 'var(--background)' : 'transparent',
                                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                            title="Grid View"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                background: viewMode === 'table' ? 'var(--background)' : 'transparent',
                                color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                            title="Table View"
                        >
                            <TableIcon size={20} />
                        </button>
                    </div>
                )}
            </div>

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)', color: 'var(--text-muted)' }}>
                    <PawPrint size={64} style={{ margin: '0 auto', marginBottom: '1rem', color: '#cbd5e1' }} />
                    <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>You haven't applied for any pets yet.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                            {applications.map((app) => (
                                <div key={app._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
                                    <div style={{ position: 'relative', height: '14rem', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                        <img
                                            src={app.pet?.images && app.pet.images.length > 0 ? app.pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                            alt={app.pet?.name || 'Pet'}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                            <StatusBadge status={app.status} />
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                            {app.pet?.name || 'Unknown Pet'}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            {app.pet?.species || 'Unknown'} • {app.pet?.breed || 'Unknown'}
                                        </p>

                                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            "{app.message}"
                                        </p>

                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={14} />
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Pet</th>
                                        <th>Name</th>
                                        <th>Application Info</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app._id}>
                                            <td style={{ width: '80px' }}>
                                                <img
                                                    src={app.pet?.images && app.pet.images.length > 0 ? app.pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                                    alt={app.pet?.name}
                                                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{app.pet?.name || 'Unknown'}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{app.message}"</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td><StatusBadge status={app.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
