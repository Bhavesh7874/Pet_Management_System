import api from './api';
import { Pet } from './pets.service';
import { User } from './auth.service';

export interface Application {
    _id: string;
    pet: Pet;
    user: User;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const createApplication = async (petId: string, message: string): Promise<Application> => {
    const { data } = await api.post<Application>('/applications', { petId, message });
    return data;
};

export const getApplications = async (): Promise<Application[]> => {
    const { data } = await api.get<Application[]>('/applications');
    return data;
};

export const getUserApplications = async (): Promise<Application[]> => {
    const { data } = await api.get<Application[]>('/applications/my');
    return data;
};

export const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Application> => {
    const { data } = await api.put<Application>(`/applications/${id}/status`, { status });
    return data;
};

const applicationsService = {
    createApplication,
    getApplications,
    updateApplicationStatus
};

export default applicationsService;
