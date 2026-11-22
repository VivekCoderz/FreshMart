import { createContext, useState } from 'react';
import api from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage on refresh (without calling /profile).
  // Read synchronously so protected routes don't redirect before it is restored.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');   // Extra safety

    if (!token) return null;
    try {
      // Agar login ke time user data save kiya tha
      if (savedUser) return JSON.parse(savedUser);
      // Fallback - token hai toh assume logged in (role ke liye login mein save kar rahe hain)
      return { role: localStorage.getItem('role') || 'customer' };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });
  const loading = false;

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

  const supplierLogin = async (email, password) => {
    const res = await api.post('/supplier/login', { email, password });

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', 'supplier');

    const userData = {
      _id: res.data.supplier.id,
      fullName: res.data.supplier.name,
      companyName: res.data.supplier.companyName,
      email: res.data.supplier.email,
      role: 'supplier'
    };

    localStorage.setItem('user', JSON.stringify(userData));
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
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, supplierLogin, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};