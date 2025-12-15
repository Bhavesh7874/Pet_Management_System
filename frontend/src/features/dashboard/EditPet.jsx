import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getPetById, updatePet } from '../../services/pets.service';
import PetForm from './components/PetForm';
import { ArrowLeft } from 'lucide-react';


const EditPet = () => {
    const [pet, setPet] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const data = await getPetById(id);
                setPet(data);
            } catch (error) {
                console.error(error); // Fixed console.error
                alert('Failed to fetch pet details');
                navigate('/admin');
            }
        };
        fetchPet();
    }, [id, navigate]);

    const handleSubmit = async (petData) => {
        try {
            await updatePet(id, petData);
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to update pet');
        }
    };

    if (!pet) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/admin')}
                className="btn btn-secondary"
                style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="card" style={{ padding: '2rem' }}>
                <h1 className="section-header" style={{ marginBottom: '2rem' }}>Edit Pet</h1>
                <PetForm onSubmit={handleSubmit} initialData={pet} buttonLabel="Update Pet" />
            </div>
        </div>
    );
};

export default EditPet;
