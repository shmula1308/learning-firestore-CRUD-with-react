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
} from "firebase/firestore";

const HomePage = () => {
  //const [users, setUsers] = useState(null);
  const dbCtx = useContext(FirestoreContext);
  const users = useGetCollectionOnChange("users");
  // useGetCollectionOnChange a custom hook, does what the code below does.
  //useEffect(() => {
  // const unsub = onSnapshot(collection(db, "users"), (col) => {
  //   const docs = [];
  //   col.forEach((doc) => {
  //     console.log(doc.data().username);
  //     docs.push({ id: doc.id, ...doc.data() });
  //   });
  //   setUsers(docs);
  // });
  // return () => {
  //   unsub();
  // };
  //   const users = dbCtx.users;
  //   setUsers(users);
  // }, [dbCtx.users]);
  // This is how we could update documents, by setting option object with merge set to true
  // const docRef = doc(db, "users", "qTmHnMEBlXeWqCh6HshFdLip12E2");
  // setDoc(docRef, { date: Timestamp.now() }, { merge: true });
  //Ass opposed to Realtime database, here you can save also null as a value

  useEffect(async () => {
    const writeToDatabaseTesting = async () => {
      // const docRef = doc(db, "users", "qTmHnMEBlXeWqCh6HshFdLip12E2"); //targeting a specific document
      // updateDoc(docRef, { timestamp: serverTimestamp() }, { merge: true });
      // const docRefCustom = doc(db, "users", "shpend"); // custom id
      // const docRefAutoGen = doc(collection(db, "users")); //auto-gen id
      // await setDoc(docRefAutoGen, {
      //   name: "Liza",
      //   colors: { color1: "red", color2: "blue", hobbies: ["running", "sexytime", "singing"] },
      // });
      // await updateDoc(docRefAutoGen, { "colors.color1": "yellow" }); // update doc in nested field
      // await updateDoc(docRefAutoGen, { "colors.hobbies": arrayUnion("mimi") });
      // const docRef = doc(db, "users", "qTmHnMEBlXeWqCh6HshFdLip12E2");
      // dbCtx.deleteDocumentField(docRef, "love");
      // const docRef = doc(db, "cities", "TOK");
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) {
      //   console.log(docSnap.data());
      // } else {
      //   console.log("The document does not exist");
      // }
      // const docRef = doc(db, "cities", "TOK");
      // try {
      //   const docSnap = await getDocFromCache(docRef);
      //   console.log(docSnap.data());
      // } catch (error) {
      //   console.log(error);
      // }
      // const q = query(collection(db, "cities"), where("capital", "==", true));
      // const docSnap = await getDocs(q); // the docs that come back are an array of docs
      // // docSnap has a forEach method that you can use to iterate overe the doc in the array
      // docSnap.forEach((doc) => {
      //   console.log(doc.data());
      // });
      // takes two argument. the colllection of documents you want to query and where() method with 3 argument that specvay the property,operator and value of the document you want to get

      await onSnapshot(doc(db, "cities", "TOK"), (doc) => {
        console.log(doc.data());
      });
    };
    // const citiesRef = collection(db, "cities");
    // await setDoc(doc(citiesRef, "SF"), {
    //   name: "San Francisco",
    //   state: "CA",
    //   country: "USA",
    //   capital: false,
    //   population: 860000,
    //   regions: ["west_coast", "norcal"],
    // });
    // await setDoc(doc(citiesRef, "LA"), {
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA",
    //   capital: false,
    //   population: 3900000,
    //   regions: ["west_coast", "socal"],
    // });
    // await setDoc(doc(citiesRef, "DC"), {
    //   name: "Washington, D.C.",
    //   state: null,
    //   country: "USA",
    //   capital: true,
    //   population: 680000,
    //   regions: ["east_coast"],
    // });
    // await setDoc(doc(citiesRef, "TOK"), {
    //   name: "Tokyo",
    //   state: null,
    //   country: "Japan",
    //   capital: true,
    //   population: 9000000,
    //   regions: ["kanto", "honshu"],
    // });
    // await setDoc(doc(citiesRef, "BJ"), {
    //   name: "Beijing",
    //   state: null,
    //   country: "China",
    //   capital: true,
    //   population: 21500000,
    //   regions: ["jingjinji", "hebei"],
    // });
    // const citiesRef = collection(db, "cities");
    // await setDoc(doc(db, "cities"), { city: "milizza" }); ---> this will not work

    writeToDatabaseTesting();
  }, []);

  return (
    <div>
      <h1>Homepage</h1>
      <p>Only authenticated users can access this page</p>
      <ul>
        {users &&
          users.map((doc) => {
            return <li key={doc.id}>{doc.email}</li>;
          })}
      </ul>

      <SignOutBtn />
    </div>
  );
};

export default HomePage;
