import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh (without calling /profile)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');   // Extra safety

    if (token) {
      try {
        // Agar login ke time user data save kiya tha
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Fallback - token hai toh assume logged in (role ke liye login mein save kar rahe hain)
          setUser({ role: localStorage.getItem('role') || 'customer' });
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);
    
    const userData = {
      _id: res.data._id,
      fullName: res.data.fullName,
      email: res.data.email,
      phone: res.data.phone,
      role: res.data.role
    };

    localStorage.setItem('user', JSON.stringify(userData));   // ← Yeh line add kardi
    setUser(userData);

    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};