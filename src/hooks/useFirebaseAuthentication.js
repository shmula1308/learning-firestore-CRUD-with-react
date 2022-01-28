import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

const useFirebaseAuthentication = (auth) => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  // Your <Router> needs to be higher up the component tree than where you use useNavigate!!!
  // we will place onAuthStateChanged in useEffect() with no dependencies, because we want it to run once and set the currently authenticated user if there is any.
  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        if (!authUser.emailVerified) {
          signOut(auth);
          return navigate("/email/verify-email");
        }

        console.log(`You have been logged in as ${authUser.email}`);
        setAuthUser(authUser);
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
