import React, { useRef, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import styles from "./SignUp.module.css";

const SignUpForm = () => {
  const authCtx = useContext(AuthContext);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = (ev) => {
    ev.preventDefault();

    const fullName = nameRef.current.value;
    const email = emailRef.current.value;
    const passwordOne = passwordRef.current.value;
    const passwordTwo = passwordConfirmationRef.current.value;

    if (passwordOne.length < 6) {
      return setError("Email must be at least 6 characters long");
    }

    if (passwordOne !== passwordTwo) {
      return setError("Passwords must match");
    }
    console.log(authCtx);
    setIsloading(true);
    setError("");
    authCtx
      .signUp(auth, email, passwordOne)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
    setIsloading(false);
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
