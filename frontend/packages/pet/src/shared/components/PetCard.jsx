import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const PetCard = ({ pet }) => {
    return (
        <div className="pet-card group">
            <div className="pet-image-container">
                <img
                    src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                    alt={pet.name}
                    className="pet-image"
                />
                <div className="pet-favorite-btn">
                    <Heart size={20} />
                </div>
                <div className="pet-breed-tag">
                    {pet.breed}
                </div>
            </div>

            <div className="pet-card-content">
                <div className="pet-card-header">
                    <h3 className="pet-name">
                        {pet.name}
                    </h3>
                    <span className="pet-age">
                        {pet.age} years
                    </span>
                </div>

                <p className="pet-description">
                    {pet.description}
                </p>

                <a
                    href={`http://localhost:3000/pets/${pet._id}`}
                    className="pet-details-btn"
                >
                    View Details
                </a>
            </div>
        </div>
    );
};

export default PetCard;
