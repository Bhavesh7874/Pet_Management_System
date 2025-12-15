import { createContext, useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            try {
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(parsedUser);
                    if (decoded.exp) {
                        const remainingTime = decoded.exp * 1000 - Date.now();
                        if (remainingTime > 0) {
                            const maxTimeout = 2147483647;
                            const timeoutDuration = remainingTime > maxTimeout ? maxTimeout : remainingTime;
                            setTimeout(logout, timeoutDuration);
                        }
                    }
                }
            } catch {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);

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
        } catch {
        }

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
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
