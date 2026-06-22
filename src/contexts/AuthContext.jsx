import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still initializing

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <AuthContext.Provider value={{
      user,
      signup:        (email, pw) => createUserWithEmailAndPassword(auth, email, pw),
      login:         (email, pw) => signInWithEmailAndPassword(auth, email, pw),
      logout:        ()          => signOut(auth),
      resetPassword: (email)     => sendPasswordResetEmail(auth, email),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
