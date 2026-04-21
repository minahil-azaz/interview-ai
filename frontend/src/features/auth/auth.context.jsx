import { createContext, useState, useEffect } from 'react';
import { getMe } from '../auth/services/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check user on app load (IMPORTANT for persistence)
    const getandSetUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getandSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};