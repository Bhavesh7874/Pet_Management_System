import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPets, deletePet } from '../../services/pets.service';
import { getApplications, updateApplicationStatus } from '../../services/applications.service';
import AuthContext from '../auth/AuthContext';
import StatusBadge from '../../shared/components/StatusBadge';
import { LayoutDashboard, FileText, Plus, Trash2, Edit, Table as TableIcon, Grid } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pets');
    const [viewMode, setViewMode] = useState('grid');
    const [pets, setPets] = useState([]);
    const [applications, setApplications] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if (activeTab === 'pets') {
                const data = await getPets({ limit: 100 });
                setPets(data.pets);
            } else if (user && user.token) {
                const data = await getApplications();
                setApplications(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDeletePet = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deletePet(id);
            fetchData();
        } catch {
            alert('Failed to delete pet');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            fetchData();
        } catch {
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <h1 className="section-header" style={{ fontSize: '1.875rem', fontWeight: 700 }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('pets')}
                        className={`btn ${activeTab === 'pets' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <LayoutDashboard size={20} />
                        Manage Pets
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <FileText size={20} />
                        Applications
                    </button>
                </div>

                {activeTab === 'pets' && (
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

            {activeTab === 'pets' ? (
                <div>
                    <button onClick={() => navigate('/admin/add-pet')} className="btn btn-primary" style={{ marginBottom: '1.5rem', background: 'var(--accent)' }}>
                        <Plus size={20} /> Add New Pet
                    </button>

                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                            {pets.map(pet => (
                                <div key={pet._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ position: 'relative', height: '14rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <img src={pet.images[0] || 'https://via.placeholder.com/300'} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                            <StatusBadge status={pet.status} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{pet.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{pet.species} • {pet.breed}</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                            For Adoption
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <button onClick={() => navigate(`/admin/edit-pet/${pet._id}`)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDeletePet(pet._id)} className="btn btn-danger" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Details</th>

                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pets.map(pet => (
                                        <tr key={pet._id}>
                                            <td style={{ width: '80px' }}>
                                                <img
                                                    src={pet.images[0] || 'https://via.placeholder.com/300'}
                                                    alt={pet.name}
                                                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{pet.name}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}>{pet.species}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pet.breed}</div>
                                            </td>


                                            <td><StatusBadge status={pet.status} /></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => navigate(`/admin/edit-pet/${pet._id}`)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePet(pet._id)}
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Type</th>
                                <th>Applicant</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td style={{ fontWeight: 500 }}>{app.pet?.name || 'Unknown'}</td>
                                    <td>
                                        <span className={`badge ${app.pet?.category === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '999px', background: app.pet?.category === 'sale' ? '#dcfce7' : '#dbeafe', color: app.pet?.category === 'sale' ? '#166534' : '#1e40af' }}>
                                            Adopt
                                        </span>
                                    </td>
                                    <td>
                                        <div>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.user?.email}</div>
                                    </td>
                                    <td style={{ maxWidth: '20rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.message}>{app.message}</td>
                                    <td><StatusBadge status={app.status} /></td>
                                    <td>
                                        {app.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleStatusUpdate(app._id, 'approved')} className="badge badge-approved" style={{ cursor: 'pointer', border: 'none' }}>Approve</button>
                                                <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="badge badge-rejected" style={{ cursor: 'pointer', border: 'none' }}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
