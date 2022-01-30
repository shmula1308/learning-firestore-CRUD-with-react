import React from "react";
import { db } from "../Firebase/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";

const FirestoreContext = React.createContext({
  // users: null,
  getEntireCollection: () => {},
  writeUserData: () => {},
  getEntireCollectionOnChange: () => {},
  updateDocument: () => {},
  deleteDocument: () => {},
  deleteDocumentField: () => {},
});

export const FirestoreContextProvider = ({ children }) => {
  // const [users, setUsers] = useState(null);

  // useEffect(() => {
  //   const unsub = onSnapshot(collection(db, "users"), (result) => {
  //     const docs = [];
  //     result.forEach((doc) => {
  //       docs.push({ id: doc.id, ...doc.data() });
  //     });
  //     setUsers(docs);
  //   });
  //   return unsub;
  // }, []);

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

  const updateDocument = async (docRef, update) => {
    await updateDoc(docRef, update);
  };

  const deleteDocument = async (docRef) => {
    await deleteDoc(docRef);
  };

  const deleteDocumentField = async (docRef, fieldToDelete) => {
    const update = {};
    update[fieldToDelete] = deleteField();
    await updateDoc(docRef, update);
  };
  return (
    <FirestoreContext.Provider
      value={{ getEntireCollection, writeUserData, updateDocument, deleteDocument, deleteDocumentField }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreContext;
