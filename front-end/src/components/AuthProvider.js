'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Spinner from './Spinner';

// Create an authentication context
const AuthContext = createContext();

// Custom hook to use the authentication context
export function useAuth() {
    return useContext(AuthContext);
}

// AuthProvider component to wrap your Next.js application
export default function AuthProvider({ children }) {

    const router = useRouter();
    const currentPath = usePathname();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            const newUser = session?.user ?? null;
            setUser(newUser);

            if (error) {
                // Handle authentication error, e.g., session retrieval failed
                console.error('Authentication error:', error);
                // Redirect to login page or show an error message
                router.replace('/signin');
                setLoading(false);

                return;
            }

            if (!newUser) {
                if (currentPath === '/forgotPassword' || currentPath === 'signup') {
                    router.replace(currentPath);
                }
                else {
                    // User is not authenticated, redirect to the signin page
                    router.replace('/signin');
                }
                setLoading(false);

            }

            if (newUser) {
                if (currentPath === '/' || (currentPath === '/forgotPassword' || currentPath === '/signup' || currentPath === '/signin')) {
                    router.replace('/dashboard')
                }
                setLoading(false)
            }
        }

        checkAuthentication();
    }, []);

    const value = {
        user,
        loading
    }

    return <AuthContext.Provider value={{ value }}>
        {loading ?
            <div className="flex justify-center items-center h-[100vh]"> <Spinner /></div>
            :
            children
        }
    </AuthContext.Provider>;
}