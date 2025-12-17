import api from './api';

export interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    description: string;
    images: string[];
    price?: number;
    status: 'available' | 'adopted' | 'pending';
    category: 'adoption' | 'sale';
}

export interface GetPetsResponse {
    pets: Pet[];
    page: number;
    pages: number;
}

export interface PetFilters {
    keyword?: string;
    category?: string;
    species?: string;
    breed?: string;
    minPrice?: string;
    maxPrice?: string;
    pageNumber?: number;
    limit?: number;
}

export const getPets = async (filters: PetFilters = {}): Promise<GetPetsResponse> => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.category) params.append('category', filters.category);
    if (filters.species) params.append('species', filters.species);
    if (filters.breed) params.append('breed', filters.breed);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const { data } = await api.get<GetPetsResponse>(`/pets?${params.toString()}`);
    return data;
};

export const getPetById = async (id: string): Promise<Pet> => {
    const { data } = await api.get<Pet>(`/pets/${id}`);
    return data;
};

export const createPet = async (formData: FormData): Promise<Pet> => {
    const { data } = await api.post<Pet>('/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const updatePet = async (id: string, formData: FormData): Promise<Pet> => {
    const { data } = await api.put<Pet>(`/pets/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const deletePet = async (id: string): Promise<void> => {
    await api.delete(`/pets/${id}`);
};

const petsService = {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};

export default petsService;
