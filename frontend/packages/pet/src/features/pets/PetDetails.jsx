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

    if (loading) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
    if (!pet) return <div className="text-center py-20 text-xl text-muted">Pet not found</div>;

    return (
        <div className="container animate-fade-in-up pb-4">
            <div className="grid gap-8">
                {/* Hero / Image Section */}
                <div className="pet-details-hero">
                    <div
                        className="pet-details-hero-blur"
                        style={{ backgroundImage: `url(${pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'})` }}
                    ></div>
                    <img
                        src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                        alt={pet.name}
                    />
                </div>

                {/* Content Section */}
                <div className="pet-details-grid">
                    {/* Main Info */}
                    <div className="info-card">
                        <div className="mb-8">
                            <div className="grid grid-cols-2 gap-4 items-center mb-8" style={{ display: 'flex' }}>
                                <span className="badge-species">
                                    {pet.species}
                                </span>
                                <StatusBadge status={pet.status} />
                            </div>
                            <h1 className="pet-title">{pet.name}</h1>
                            <p className="pet-breed-large">{pet.breed}</p>
                        </div>

                        <div>
                            <h3 className="about-header">
                                About {pet.name}
                            </h3>
                            <p className="text-secondary leading-relaxed text-lg">
                                {pet.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="grid gap-6">
                        <div className="card bg-surface-alt border-none">
                            <div className="grid md:grid-cols-2 gap-md">
                                <div className="stat-card">
                                    <Calendar size={24} style={{ color: 'var(--secondary)', margin: '0 auto 0.5rem' }} />
                                    <p className="stat-label">Age</p>
                                    <p className="stat-value">{pet.age} <span className="text-sm font-medium">yrs</span></p>
                                </div>
                                <div className="stat-card">
                                    <p className="stat-label">Status</p>
                                    <p className="stat-value text-base capitalize">{pet.status}</p>
                                </div>
                            </div>
                        </div>

                        {pet.status === 'available' ? (
                            <button
                                onClick={handleAdoptClick}
                                className="btn btn-primary adopt-btn-lg"
                            >
                                {actionLabel} {pet.name}
                            </button>
                        ) : (
                            <div className="unavailable-card">
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
                    <form onSubmit={submitApplication} className="auth-form border-none shadow-none p-0">
                        <div className="form-group">
                            <label className="label">
                                Why do you want to adopt {pet.name}?
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="textarea textarea-lg"
                                placeholder="Tell us about yourself and your home..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
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
