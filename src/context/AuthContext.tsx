import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User 
} from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check for KIIT domain
        if (!currentUser.email?.endsWith('@kiit.ac.in')) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          alert('Access restricted to rolls@kiit.ac.in emails only.');
          return;
        }

        setUser(currentUser);
        
        // Check roles in Firestore
        const email = currentUser.email;
        const [adminDoc, memberDoc] = await Promise.all([
          getDoc(doc(db, 'admins', email)),
          getDoc(doc(db, 'members', email))
        ]);

        setIsAdmin(adminDoc.exists());
        setIsMember(memberDoc.exists());

        // Sync to users collection if new
        const rollNumber = email.split('@')[0];
        const userRef = doc(db, 'users', rollNumber);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: adminDoc.exists() ? 'admin' : (memberDoc.exists() ? 'member' : 'user'),
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsMember(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isMember, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
