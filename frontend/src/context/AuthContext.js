import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const getApiBase = () => {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000`;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('atlas_session');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, tokenData, refreshData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('token', tokenData);
        localStorage.setItem('atlas_session', JSON.stringify(userData));
        // ✅ Guardar el refresh token
        if (refreshData) {
            localStorage.setItem('refresh_token', refreshData);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('atlas_session');
        toast.info('Sesión cerrada correctamente');
    };

    // ✅ Función para renovar el access token usando el refresh token
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            logout();
            return null;
        }

        try {
            const response = await fetch(`${getApiBase()}/api/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                const newToken = data.access;
                setToken(newToken);
                localStorage.setItem('token', newToken);
                return newToken;
            } else {
                // Refresh token también expiró, cerrar sesión
                logout();
                return null;
            }
        } catch (error) {
            console.error("Error al renovar token:", error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, refreshAccessToken, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);