import api from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
    isAdmin?: boolean;
}

export interface LoginResponse extends User { }
export interface RegisterResponse extends User { }

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>('/auth/register', { name, email, password });
    return data;
};

const authService = {
    login,
    register,
};

export default authService;
