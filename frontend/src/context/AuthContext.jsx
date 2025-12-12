import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Define logout first so it can be used in useEffect
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    // Initial check for user info in localStorage
    // This block is executed on component mount and re-renders
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Check token expiration
            try {
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(parsedUser);
                    // Set timer for remaining time
                    if (decoded.exp) {
                        const remainingTime = decoded.exp * 1000 - Date.now();
                        if (remainingTime > 0) {
                            const maxTimeout = 2147483647;
                            const timeoutDuration = remainingTime > maxTimeout ? maxTimeout : remainingTime;
                            setTimeout(logout, timeoutDuration);
                        }
                    }
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, config);

        // Set auto-logout on new login
        try {
            const decoded = jwtDecode(data.token);
            if (decoded.exp) {
                const remainingTime = decoded.exp * 1000 - Date.now();
                if (remainingTime > 0) {
                    const maxTimeout = 2147483647;
                    const timeoutDuration = remainingTime > maxTimeout ? maxTimeout : remainingTime;
                    setTimeout(logout, timeoutDuration);
                }
            }
        } catch (error) {
            // Silently fail if token decode fails, normal flow continues
        }

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password }, config);

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
