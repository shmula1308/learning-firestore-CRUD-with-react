import React from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";

const FirestoreContext = React.createContext({
  writeDataToCollection: () => {},
  getEntireCollection: () => {},
});

export const FirestoreContextProvider = ({ children }) => {
  const writeDataToCollection = (db, col, doc) => {
    return addDoc(collection(db, col), doc);
  };

  const getEntireCollection = (db, col) => {
    return getDocs(collection(db, col));
  };
  return (
    <FirestoreContext.Provider value={{ writeDataToCollection, getEntireCollection }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreContext;
