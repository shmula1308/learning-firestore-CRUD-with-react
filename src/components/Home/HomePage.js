import React, { useEffect, useState, useContext } from "react";
import FirestoreContext from "../contexts/FirestoreContext";
import useGetCollectionOnChange from "../../hooks/useGetCollectionOnChange";
import SignOutBtn from "../SignOutButton/SignOutBtn";
import { db } from "../Firebase/firebase";
import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocFromCache,
  query,
  where,
  getDocs,
  startAt,
  startAfter,
  orderBy,
  endAt,
  endBefore,
  limit,
  limitToLast,
} from "firebase/firestore";

const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [befLast, setBeforeLast] = useState(null);
  const [documentSnapshotSize, setDocumentSnapshotSize] = useState(null);

  //const [users, setUsers] = useState(null);
  const dbCtx = useContext(FirestoreContext);
  const users = useGetCollectionOnChange("users");

  useEffect(async () => {
    const displayCities = async () => {
      // Query the first page of docs
      const first = query(collection(db, "cities"), orderBy("name"), limit(2));
      const documentSnapshots = await getDocs(first);
      const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      setLastVisible(lastVis);

      const cityArray = [];
      documentSnapshots.forEach((doc) => {
        cityArray.push({ id: doc.id, ...doc.data() });
      });
      setCities(cityArray);
    };
    displayCities();
  }, []);

  const onNextPageHandler = async () => {
    const next = query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(2));
    const documentSnapshots = await getDocs(next);

    // there are no more document in the collection. Stop the next
    if (!documentSnapshots.docs.length) {
      return;
    }

    //Keep in mind the possibility of documents being updated by other users as you paginate. How to show updates in real time? Will a book be reserved and be updated on the screen for the other user to see. This is going to be the most difficult implementation for which i havent thought about

    const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lastVis);

    const cityArray = [];
    documentSnapshots.forEach((doc) => {
      cityArray.push({ id: doc.id, ...doc.data() });
    });
    setCities(cityArray);
  };

  const onPreviousPageHandler = async () => {
    console.log("Previous");
  };

  return (
    <div>
      <h1>Homepage</h1>
      <p>Only authenticated users can access this page</p>
      <ul>
        {cities.length > 0 &&
          cities.map((doc) => {
            return <li key={doc.id}>{doc.name}</li>;
          })}
      </ul>
      <div>
        <button onClick={onPreviousPageHandler}>Previous</button>
        <button onClick={onNextPageHandler}>Next</button>
      </div>
      <SignOutBtn />
    </div>
  );
};

export default HomePage;
