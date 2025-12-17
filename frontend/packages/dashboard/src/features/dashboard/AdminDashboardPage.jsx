import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPets, deletePet } from '../../services/pets.service';
import { getApplications, updateApplicationStatus } from '../../services/applications.service';
import AuthContext from 'authApp/AuthContext';
import StatusBadge from '../../shared/components/StatusBadge';
import { LayoutDashboard, FileText, Plus, Trash2, Edit, Table as TableIcon, Grid } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pets');
    const [viewMode, setViewMode] = useState('grid');
    const [pets, setPets] = useState([]);
    const [applications, setApplications] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
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
    }, [activeTab, user]);

    useEffect(() => {
        setTimeout(() => fetchData(), 0);
    }, [fetchData]);

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
        <div className="dashboard-container">
            <h1 className="section-title text-center mb-8">Admin Dashboard</h1>

            <div className="dashboard-header">
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

            {activeTab === 'pets' ? (
                <div>
                    <button onClick={() => navigate('/admin/add-pet')} className="btn btn-primary" style={{ marginBottom: '1.5rem', background: 'var(--accent)' }}>
                        <Plus size={20} /> Add New Pet
                    </button>

                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                            {pets.map(pet => (
                                <div key={pet._id} className="pet-card">
                                    <div className="pet-image-container">
                                        <div
                                            className="pet-image-blur"
                                            style={{ backgroundImage: `url(${pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'})` }}
                                        ></div>
                                        <img
                                            src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                            alt={pet.name}
                                            className="pet-image"
                                        />
                                        <div className="card-badge">
                                            <StatusBadge status={pet.status} />
                                        </div>
                                    </div>

                                    <div className="pet-card-content">
                                        <div>
                                            <h3 className="card-title">{pet.name}</h3>
                                            <p className="card-subtitle">{pet.species} • {pet.breed}</p>
                                        </div>

                                        <div className="action-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                            <button onClick={() => navigate(`/admin/edit-pet/${pet._id}`)} className="btn btn-secondary action-btn">
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button onClick={() => handleDeletePet(pet._id)} className="btn btn-danger action-btn">
                                                <Trash2 size={14} /> Delete
                                            </button>
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
                                                    className="table-image"
                                                />
                                            </td>
                                            <td className="table-cell-title">{pet.name}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}>{pet.species}</div>
                                                <div className="table-cell-sub">{pet.breed}</div>
                                            </td>
                                            <td><StatusBadge status={pet.status} /></td>
                                            <td>
                                                <div className="table-action-group">
                                                    <button
                                                        onClick={() => navigate(`/admin/edit-pet/${pet._id}`)}
                                                        className="btn btn-secondary action-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePet(pet._id)}
                                                        className="btn btn-danger action-btn"
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
                                        <span className={`badge-pill ${app.pet?.category === 'sale' ? 'badge-available' : 'badge-pending'}`}>
                                            Adopt
                                        </span>
                                    </td>
                                    <td>
                                        <div>{app.user?.name}</div>
                                        <div className="table-cell-sub">{app.user?.email}</div>
                                    </td>
                                    <td style={{ maxWidth: '20rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.message}>{app.message}</td>
                                    <td><StatusBadge status={app.status} /></td>
                                    <td>
                                        {app.status === 'pending' && (
                                            <div className="table-action-group">
                                                <button onClick={() => handleStatusUpdate(app._id, 'approved')} className="badge badge-approved cursor-pointer border-none">Approve</button>
                                                <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="badge badge-rejected cursor-pointer border-none">Reject</button>
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
