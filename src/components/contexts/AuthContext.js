import React from "react";
import { auth } from "../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useFirebaseAuthentication from "../../hooks/useFirebaseAuthentication";

const AuthContext = React.createContext({
  signUp: () => {},
  verifyUserEmail: () => {},
  signOut: () => {},
  signIn: () => {},
  authUser: null,
});

export const AuthContextProvider = ({ children }) => {
  const authUser = useFirebaseAuthentication(auth);

  const signUp = (auth, email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (auth, email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const verifyUserEmail = () => {
    return sendEmailVerification(auth.currentUser, {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });
  };
  return (
    <AuthContext.Provider value={{ signUp, verifyUserEmail, authUser, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
