import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import AuthContext from '../context/AuthContext';
import PetForm from '../components/PetForm';
import { ArrowLeft } from 'lucide-react';

const AddPet = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (petData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(`${API_BASE_URL}/pets`, petData, config);
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to create pet');
        }
    };

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
                <h1 className="section-header" style={{ marginBottom: '2rem' }}>Add New Pet</h1>
                <PetForm onSubmit={handleSubmit} buttonLabel="Create Pet" />
            </div>
        </div>
    );
};

export default AddPet;
