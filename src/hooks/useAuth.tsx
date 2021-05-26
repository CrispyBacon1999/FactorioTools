import { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";

export interface AuthContext {
  user: firebase.User | boolean | null;
  signin: (email: string, password: string) => Promise<firebase.User | null>;
  signup: (email: string, password: string) => Promise<firebase.User | null>;
  signout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  confirmPasswordReset: (code: string, password: string) => Promise<boolean>;
}

const authContext = createContext<AuthContext>({} as AuthContext);

export function ProvideAuth({ children }: { children: any }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User | boolean | null>(null);
  const signin = (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response: firebase.auth.UserCredential) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email: string, password: string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response: firebase.auth.UserCredential) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code: string, password: string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}
