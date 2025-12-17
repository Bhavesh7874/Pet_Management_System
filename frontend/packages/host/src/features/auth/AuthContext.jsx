import { createContext, useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('userInfo');
        document.cookie = 'userInfo=; path=/; max-age=0; SameSite=Lax';
        setUser(null);
    };
    useEffect(() => {
        let storedUser = localStorage.getItem('userInfo');

        // If not in localStorage, check cookies (for cross-port auth)
        if (!storedUser) {
            const cookies = document.cookie.split(';');
            const userCookie = cookies.find(c => c.trim().startsWith('userInfo='));
            if (userCookie) {
                const cookieValue = userCookie.split('=')[1];
                if (cookieValue) {
                    try {
                        storedUser = decodeURIComponent(cookieValue);
                        // Sync to localStorage so api interceptor works
                        localStorage.setItem('userInfo', storedUser);
                    } catch (e) {
                        console.error("Error parsing cookie", e);
                    }
                }
            }
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('userInfo');
                    document.cookie = 'userInfo=; path=/; max-age=0; SameSite=Lax';
                } else {
                    setUser(parsedUser);
                    // Sync cookie if we have localStorage but no cookie (e.g. focused on one tab)
                    document.cookie = `userInfo=${encodeURIComponent(storedUser)}; path=/; max-age=86400; SameSite=Lax`;

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
                localStorage.removeItem('userInfo');
                document.cookie = 'userInfo=; path=/; max-age=0; SameSite=Lax';
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
        } catch (error) {
            console.error("Invalid token", error);
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
