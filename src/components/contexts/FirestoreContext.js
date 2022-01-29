import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";

const FirestoreContext = React.createContext({
  users: null,
  getEntireCollection: () => {},
  writeUserData: () => {},
  getEntireCollectionOnChange: () => {},
});

export const FirestoreContextProvider = ({ children }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (result) => {
      const docs = [];
      result.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setUsers(docs);
    });
    return unsub;
  }, []);

  const writeUserData = async (db, documentId, document) => {
    const docRef = doc(db, "users", documentId);
    await setDoc(docRef, document);
  };
  const getEntireCollection = async (db, col) => {
    const querySnapshot = await getDocs(collection(db, col));
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  };
  return (
    <FirestoreContext.Provider value={{ getEntireCollection, writeUserData, users }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreContext;
