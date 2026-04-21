import { useContext,useEffect } from 'react';
import { AuthContext } from "../auth.context";
import { register, login, logout, getMe } from '../services/auth.api';

export const useAuth = () => {
   const context = useContext(AuthContext);
   const { user, setUser, loading, setLoading } = context;

   const handleLogin = async (email, password) => {
      setLoading(true);
      try {
         const data = await login({ email, password });
         setUser(data.user);
      } catch (error) {
         console.error('Login failed:', error);
      } finally {
         setLoading(false);
      }
   }
    
   const handleRegister = async (name, email, password) => {
      setLoading(true);
      try {
         const data = await register({ name, email, password });
         setUser(data.user);
      } catch (error) {
         console.error('Registration failed:', error);
      } finally {
         setLoading(false);
      }
   }

   const handleLogout = async () => {
      setLoading(true);
      try {
         await logout();
         setUser(null);
      } catch (error) {
         console.error('Logout failed:', error);
      } finally {
         setLoading(false);
      }
   }

     useEffect(() => {
        const getandSetUser = async () => {
            // get the user from the backend and set it in the context
            const data = await getMe();
            // set the user in the context
            setuser(data.user);
            // set loading to false after getting the user data
            setLoading(false);

        };
        getandSetUser();
    }, []);

   return { user, loading, handleLogin, handleRegister, handleLogout }
}