// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    setIsLoggedIn(false);
    // You can also clear cookies, localStorage, etc. here if needed
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook to be used in other components
export const useAuth = () => useContext(AuthContext);
