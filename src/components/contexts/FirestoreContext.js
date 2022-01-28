import React from "react";
import { collection, getDocs } from "firebase/firestore";

const FirestoreContext = React.createContext({
  getEntireCollection: () => {},
});

export const FirestoreContextProvider = ({ children }) => {
  const getEntireCollection = (db, col) => {
    return getDocs(collection(db, col));
  };
  return <FirestoreContext.Provider value={{ getEntireCollection }}>{children}</FirestoreContext.Provider>;
};

export default FirestoreContext;
