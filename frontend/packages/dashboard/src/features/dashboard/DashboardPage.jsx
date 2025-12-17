import { useState, useEffect, useContext } from 'react';
import AuthContext from 'authApp/AuthContext';
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
        <div className="dashboard-container-sm">
            <div className="dashboard-header">
                <h1 className="section-title">My Adoption Applications</h1>

                {applications.length > 0 && (
                    <div className="view-toggle">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : 'inactive'}`}
                            title="Grid View"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : 'inactive'}`}
                            title="Table View"
                        >
                            <TableIcon size={20} />
                        </button>
                    </div>
                )}
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <PawPrint size={64} style={{ margin: '0 auto', marginBottom: '1rem', color: '#cbd5e1' }} />
                    <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>You haven't applied for any pets yet.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                            {applications.map((app) => (
                                <div key={app._id} className="card dashboard-card">
                                    <div className="card-image-wrapper">
                                        <img
                                            src={app.pet?.images && app.pet.images.length > 0 ? app.pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                            alt={app.pet?.name || 'Pet'}
                                            className="card-image"
                                        />
                                        <div className="card-badge">
                                            <StatusBadge status={app.status} />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">
                                            {app.pet?.name || 'Unknown Pet'}
                                        </h3>
                                        <p className="card-subtitle">
                                            {app.pet?.species || 'Unknown'} • {app.pet?.breed || 'Unknown'}
                                        </p>

                                        <p className="card-message">
                                            "{app.message}"
                                        </p>

                                        <div className="card-footer">
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
                                                    className="table-image"
                                                />
                                            </td>
                                            <td className="table-cell-title">{app.pet?.name || 'Unknown'}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{app.message}"</div>
                                                <div className="table-cell-sub" style={{ marginTop: '0.25rem' }}>
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
