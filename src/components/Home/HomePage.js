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
  const [firstVisible, setFirstVisible] = useState(null);
  const [documentSnapshotSize, setDocumentSnapshotSize] = useState(null);

  //const [users, setUsers] = useState(null);
  const dbCtx = useContext(FirestoreContext);
  const users = useGetCollectionOnChange("users");

  // useEffect(() => {
  //   const displayCities = async () => {
  //     // Query the first page of docs
  //     const first = query(collection(db, "cities"), orderBy("name"), limit(4));
  //     const documentSnapshots = await getDocs(first);
  //     const firstVis = documentSnapshots.docs[0];
  //     const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //     setFirstVisible(firstVis);
  //     setLastVisible(lastVis);

  //     const cityArray = [];
  //     documentSnapshots.forEach((doc) => {
  //       cityArray.push({ id: doc.id, ...doc.data() });
  //     });
  //     setCities(cityArray);
  //   };
  //   displayCities();
  // }, []);

  useEffect(() => {
    // Query the first page of docs
    const first = query(collection(db, "cities"), where("capital", "==", true), orderBy("name"), limit(3));

    const unsubscribe = onSnapshot(first, (result) => {
      console.log(result);
      const cities = [];
      const firstVis = result.docs[0];
      const lastVis = result.docs[result.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      result.forEach((city) => {
        cities.push({ id: city.id, ...city.data() });
      });
      setCities(cities);
    });
    return unsubscribe;
  }, []);

  const onNextPageHandler = () => {
    const next = query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(3));
    // Im not unsubscribing because this is not a lifecycle method. I need a realtime listener for every document that the user is looking at, in case someone else reserves the book
    onSnapshot(next, (result) => {
      if (!result.docs.length) {
        return;
      }
      setDocumentSnapshotSize(result.size);
      const firstVis = result.docs[0];
      const lastVis = result.docs[result.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cities = [];
      result.forEach((city) => {
        cities.push({ id: city.id, ...city.data() });
      });
      setCities(cities);
    });
  };

  // const onNextPageHandler = async () => {
  //   const next = query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(4));
  //   const documentSnapshots = await getDocs(next);

  //   // there are no more document in the collection. Stop the next
  //   if (!documentSnapshots.docs.length) {
  //     return;
  //   }
  //   setDocumentSnapshotSize(documentSnapshots.size);
  //   //Keep in mind the possibility of documents being updated by other users as you paginate. How to show updates in real time? Will a book be reserved and be updated on the screen for the other user to see. This is going to be the most difficult implementation for which i havent thought about

  //   const firstVis = documentSnapshots.docs[0];
  //   const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //   setFirstVisible(firstVis);
  //   setLastVisible(lastVis);

  //   const cityArray = [];
  //   documentSnapshots.forEach((doc) => {
  //     cityArray.push({ id: doc.id, ...doc.data() });
  //   });
  //   setCities(cityArray);
  // };

  const onPreviousPageHandler = async () => {
    if (documentSnapshotSize === 1) {
      const previous = query(
        collection(db, "cities"),
        orderBy("name"),
        endBefore(lastVisible),
        limitToLast(3)
      );
      const documentSnapshots = await getDocs(previous);

      //there are no more previous documents in the collection. Stop the previous
      if (!documentSnapshots.docs.length) {
        return;
      }
      setDocumentSnapshotSize(documentSnapshots.size);
      const firstVis = documentSnapshots.docs[0];
      const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cityArray = [];
      documentSnapshots.forEach((doc) => {
        cityArray.push({ id: doc.id, ...doc.data() });
      });
      setCities(cityArray);
    } else {
      const previous = query(
        collection(db, "cities"),
        orderBy("name"),
        endBefore(firstVisible),
        limitToLast(3)
      );

      const documentSnapshots = await getDocs(previous);

      if (!documentSnapshots.docs.length) {
        return;
      }
      setDocumentSnapshotSize(documentSnapshots.size);
      const firstVis = documentSnapshots.docs[0];
      const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cityArray = [];
      documentSnapshots.forEach((doc) => {
        cityArray.push({ id: doc.id, ...doc.data() });
      });
      setCities(cityArray);
    }
  };

  const onUpdateHandler = () => {
    const docRef = doc(db, "cities", "TOK");
    dbCtx.updateDocument(docRef, {
      country: "JA",
    });
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
        <button onClick={onUpdateHandler}>Update City</button>
      </div>
      <SignOutBtn />
    </div>
  );
};

export default HomePage;
