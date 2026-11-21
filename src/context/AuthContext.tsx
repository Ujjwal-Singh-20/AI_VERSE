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
  isGuest: boolean;
  continueAsGuest: () => void;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const createGuestUser = (): User => {
  return {
    uid: 'guest_user',
    displayName: 'Guest Explorer',
    email: 'guest@sandbox.local',
    emailVerified: false,
    isAnonymous: true,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'guest',
  } as unknown as User;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('ai_verse_is_guest', 'true');
    setUser(createGuestUser());
    setLoading(false);

    // Record guest visit counter in backend once per session
    if (!sessionStorage.getItem('ai_verse_guest_visit_logged')) {
      sessionStorage.setItem('ai_verse_guest_visit_logged', 'true');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      fetch(`${backendUrl}/analytics/guest-visit`, { method: 'POST' }).catch(() => {});
    }
  };

  useEffect(() => {
    const isGuestSaved = localStorage.getItem('ai_verse_is_guest') === 'true';

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        localStorage.removeItem('ai_verse_is_guest');
        setIsGuest(false);

        // Check for KIIT domain
        if (!currentUser.email?.endsWith('@kiit.ac.in')) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          alert('Access restricted to rolls@kiit.ac.in emails only. Feel free to explore as Guest!');
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
        if (isGuestSaved) {
          setIsGuest(true);
          setUser(createGuestUser());
          if (!sessionStorage.getItem('ai_verse_guest_visit_logged')) {
            sessionStorage.setItem('ai_verse_guest_visit_logged', 'true');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            fetch(`${backendUrl}/analytics/guest-visit`, { method: 'POST' }).catch(() => {});
          }
        } else {
          setUser(null);
          setIsGuest(false);
        }
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

  const logOut = async () => {
    localStorage.removeItem('ai_verse_is_guest');
    setIsGuest(false);
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isMember, isGuest, continueAsGuest, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
