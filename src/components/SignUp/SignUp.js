import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import FirestoreContext from "../contexts/FirestoreContext";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import { db } from "../Firebase/firebase";
import styles from "./SignUp.module.css";
import { doc, setDoc } from "firebase/firestore";

const SignUpForm = () => {
  const authCtx = useContext(AuthContext);
  const dbCtx = useContext(FirestoreContext);
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = async (ev) => {
    ev.preventDefault();

    const fullName = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const passwordOne = passwordRef.current.value;
    const passwordTwo = passwordConfirmationRef.current.value;

    if (passwordOne.length < 6) {
      return setError("Email must be at least 6 characters long");
    }

    if (passwordOne !== passwordTwo) {
      return setError("Passwords must match");
    }
    try {
      setIsloading(true);
      setError("");

      // signup user and add their credentials to firebase authentication
      const userCredential = await authCtx.signUp(auth, email, passwordOne);
      await authCtx.verifyUserEmail();

      const document = {
        username: fullName,
        email,
      };

      const uid = userCredential.user.uid;

      // write user data to firestore. Pass in the pointer to db, collection name(implicitly created) and document, also Im supplying my own custom id.
      // const docRef = doc(db, "users", uid);
      // await setDoc(docRef, document);
      dbCtx.writeUserData(db, uid, document);

      // setIsloading(false); in the hook useFirebaseAuthentication the redirect is happening before the setIsLoading(false) and rerender of the signup component happens causing a memory leak. Since there is no error, perhaps there is no need to setLoading to false
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      setIsloading(false);
    }
  };

  return (
    <div className={styles["form-container"]}>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={styles["form-control"]}>
          <label htmlFor='fullname'>Full Name</label>
          <input ref={nameRef} type='text' name='fullname' placeholder='Full Name' required />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor='email'>Email</label>
          <input ref={emailRef} type='text' name='email' placeholder='Email' required />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor='password'>Password</label>
          <input ref={passwordRef} type='password' name='password' placeholder='Password' required />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor='password'>Password Confirmation</label>
          <input
            ref={passwordConfirmationRef}
            type='password'
            name='password'
            placeholder='Password Confirmation'
            required
          />
        </div>
        <button type='submit' disabled={isLoading}>
          Sign Up
        </button>

        {error && <div>{error}</div>}
        <p>
          Already have an account? <Link to='/signin'>Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
