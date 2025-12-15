import { useState, useEffect } from 'react';

const PetForm = ({ onSubmit, initialData = null, buttonLabel = 'Save Pet' }) => {
    const [formDataState, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        description: '',
        imageUrl: '',
        imageFile: null,
        status: 'available',
        category: 'adoption',

    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                species: initialData.species || '',
                breed: initialData.breed || '',
                age: initialData.age || '',
                description: initialData.description || '',
                imageUrl: initialData.images ? initialData.images[0] : '',
                imageFile: null,
                status: initialData.status || 'available',
                category: initialData.category || 'adoption',

            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formDataState, imageFile: e.target.files[0] });
        } else {
            setFormData({ ...formDataState, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formDataState.name);
        formData.append('species', formDataState.species);
        formData.append('breed', formDataState.breed);
        formData.append('age', formDataState.age);
        formData.append('description', formDataState.description);
        formData.append('status', formDataState.status);
        formData.append('category', formDataState.category);

        if (formDataState.imageFile) {
            formData.append('image', formDataState.imageFile);
        } else if (formDataState.imageUrl) {
            formData.append('images', [formDataState.imageUrl]); // Fallback if no file/keeping URL
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0, boxShadow: 'none', border: 'none' }}>
            <div className="grid grid-cols-2 gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label className="label">Name</label>
                    <input name="name" value={formDataState.name} onChange={handleChange} className="input" required />
                </div>
                <div className="form-group">
                    <label className="label">Species</label>
                    <input name="species" value={formDataState.species} onChange={handleChange} className="input" placeholder="Dog/Cat" required />
                </div>
                <div className="form-group">
                    <label className="label">Breed</label>
                    <input name="breed" value={formDataState.breed} onChange={handleChange} className="input" required />
                </div>
                <div className="form-group">
                    <label className="label">Age</label>
                    <input name="age" type="number" value={formDataState.age} onChange={handleChange} className="input" required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                    <label className="label">Category</label>
                    <select name="category" value={formDataState.category} onChange={handleChange} className="select">
                        <option value="adoption">Adoption</option>
                    </select>
                </div>

            </div>
            <div className="form-group">
                <label className="label">Image</label>
                <input name="image" type="file" onChange={handleChange} className="input" accept="image/*" />
                {formDataState.imageUrl && <p className="text-xs text-muted mt-1">Current: <a href={formDataState.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>}
            </div>
            <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" value={formDataState.description} onChange={handleChange} className="textarea" style={{ height: '6rem' }} required />
            </div>
            {initialData && (
                <div className="form-group">
                    <label className="label">Status</label>
                    <select name="status" value={formDataState.status} onChange={handleChange} className="select">
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="adopted">Adopted</option>
                    </select>
                </div>
            )}
            <button type="submit" className="btn btn-primary w-full">
                {buttonLabel}
            </button>
        </form>
    );
};

export default PetForm;
