import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../components/Firebase/firebase";

const useFirebaseAuthentication = (auth) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("authUser")));
  const navigate = useNavigate();
  // Your <Router> needs to be higher up the component tree than where you use useNavigate!!!
  // we will place onAuthStateChanged in useEffect() with no dependencies, because we want it to run once and set the currently authenticated user if there is any, in state and localStorage
  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        if (!authUser.emailVerified) {
          signOut(auth);
          return navigate("/email/verify-email");
        }

        const authUserId = authUser.uid;

        const docRef = doc(db, "users", authUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          authUser = {
            uid: authUser.uid,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            providerId: authUser.providerData[0].providerId,
            ...docData,
          };
          localStorage.setItem("authUser", JSON.stringify(authUser));
          console.log(`You have been logged in as ${authUser.email}`);
          setAuthUser(authUser);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        setAuthUser(null);
        console.log(`You have been logged out`);
      }
    });
    return () => {
      unlisten();
    };
  }, [auth, navigate]);

  return authUser;
};

export default useFirebaseAuthentication;
