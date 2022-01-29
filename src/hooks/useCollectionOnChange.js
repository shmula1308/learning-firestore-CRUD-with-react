import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../components/Firebase/firebase";

const useGetCollectionOnChange = (col) => {
  const [docs, setDocs] = useState(null);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, col), (result) => {
      const docs = [];
      result.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocs(docs);
    });
    return unsub;
  }, []);
  return docs;
};

export default useGetCollectionOnChange;
