import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getPetById } from '../../services/pets.service';
import { createApplication } from '../../services/applications.service';
import AuthContext from 'authApp/AuthContext';
import StatusBadge from '../../shared/components/StatusBadge';
import Modal from '../../shared/components/Modal';
import { Calendar } from 'lucide-react';

const PetDetails = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const data = await getPetById(id);
                setPet(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleAdoptClick = () => {
        if (!user) {
            window.location.href = 'http://localhost:3001/login';
            return;
        }
        setIsModalOpen(true);
    };

    const actionLabel = 'Adopt';

    const submitApplication = async (e) => {
        e.preventDefault();
        try {
            await createApplication(id, message);
            setIsModalOpen(false);
            alert('Adoption application submitted successfully!');
            window.location.href = 'http://localhost:3000/dashboard';
        } catch (error) {
            alert(error.response?.data?.message || 'Application failed');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div></div>;
    if (!pet) return <div className="text-center py-20 text-xl text-gray-600">Pet not found</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Image Section */}
                <div style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <img
                        src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                        alt={pet.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-lg">
                    {/* Main Info */}
                    <div className="card" style={{ gridColumn: 'span 2' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.875rem' }}>
                                    {pet.species}
                                </span>
                                <StatusBadge status={pet.status} />
                            </div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1 }}>{pet.name}</h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>{pet.breed}</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {/* <Info size={20} className="text-secondary" /> */}
                                About {pet.name}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                                {pet.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ background: 'var(--surface-alt)', border: 'none' }}>
                            <div className="grid grid-cols-2 gap-md">
                                <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                    <Calendar size={24} style={{ color: 'var(--secondary)', margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Age</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{pet.age} <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>yrs</span></p>
                                </div>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                    {/* <Activity size={24} style={{ color: 'var(--accent)', margin: '0 auto 0.5rem' }} /> */}
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</p>
                                    <p style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize' }}>{pet.status}</p>
                                </div>

                            </div>
                        </div>

                        {pet.status === 'available' ? (
                            <button
                                onClick={handleAdoptClick}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
                            >
                                {actionLabel} {pet.name}
                            </button>
                        ) : (
                            <div className="card" style={{ textAlign: 'center', background: 'var(--background)', color: 'var(--text-muted)' }}>
                                This pet is currently not available for adoption.
                            </div>
                        )}
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`${actionLabel} ${pet.name}`}
                >
                    <form onSubmit={submitApplication} className="auth-form" style={{ padding: 0, boxShadow: 'none', border: 'none' }}>
                        <div className="form-group">
                            <label className="label">
                                Why do you want to adopt {pet.name}?
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="textarea"
                                style={{ height: '8rem', resize: 'none' }}
                                placeholder="Tell us about yourself and your home..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Submit Application
                        </button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default PetDetails;
