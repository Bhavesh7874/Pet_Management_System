import { createContext, useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax";
    };

    const eraseCookie = (name) => {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    const logout = () => {
        eraseCookie('userInfo');
        setUser(null);
    };

    useEffect(() => {
        const storedUser = getCookie('userInfo');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    eraseCookie('userInfo');
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
                eraseCookie('userInfo');
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
        setCookie('userInfo', JSON.stringify(data), 1);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
        setUser(data);
        setCookie('userInfo', JSON.stringify(data), 1);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
