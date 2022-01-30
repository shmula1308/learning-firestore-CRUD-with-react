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
    };

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
