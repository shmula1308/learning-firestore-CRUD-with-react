import React, { useEffect, useState, useContext } from "react";
import FirestoreContext from "../contexts/FirestoreContext";
import useGetCollectionOnChange from "../../hooks/useCollectionOnChange";
import SignOutBtn from "../SignOutButton/SignOutBtn";
import { db } from "../Firebase/firebase";
import { onSnapshot, collection } from "firebase/firestore";

const HomePage = () => {
  //const [users, setUsers] = useState(null);
  const dbCtx = useContext(FirestoreContext);
  const users = useGetCollectionOnChange("users");
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
