import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = React.createContext({ signUp: () => {} });

export const AuthContextProvider = ({ children }) => {
  const signUp = (auth, email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  return <AuthContext.Provider value={{ signUp }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
