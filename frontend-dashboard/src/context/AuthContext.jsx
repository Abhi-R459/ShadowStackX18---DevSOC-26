import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import {
  loginWithEmailAndPassword,
  createUser,
  sendPasswordReset,
  logout,
  sendVerificationEmail,
  reloadUser as reloadUserService,
  getUserProfile,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setProfileLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        setProfileLoading(true);
        const profile = await getUserProfile(firebaseUser.uid);
        setRole(profile?.role || null);
        setProfileLoading(false);
      } else {
        setRole(null);
        setProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const credential = await loginWithEmailAndPassword(email, password);
    const profile = await getUserProfile(credential.user.uid);
    setRole(profile?.role || null);
    return { credential, role: profile?.role || null };
  };

  const signUp = async (email, password, roleForUser = "customer") => {
    const credential = await createUser(email, password, roleForUser);
    try {
      if (credential?.user) {
        await sendVerificationEmail(credential.user);
        setRole(roleForUser);
      }
    } catch (_) {
      // User created; they can resend later
    }
    return credential;
  };

  const resetPassword = (email) => sendPasswordReset(email);
  const signOut = () => logout();
  const sendVerification = (userToVerify) => sendVerificationEmail(userToVerify);
  const reloadUser = (userToReload) => reloadUserService(userToReload);

  const value = {
    user,
    loading,
    role,
    profileLoading,
    login,
    signUp,
    resetPassword,
    signOut,
    sendVerification,
    reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
