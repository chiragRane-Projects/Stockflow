"use client"
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');

            if (!res.ok) {
                setUser(null)
            } else {
                const data = await res.json();
                setUser(data.user);
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async() => {
        await fetch("/api/auth/logout",
            {method: 'POST'}
        );
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser, loading, fetchUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);