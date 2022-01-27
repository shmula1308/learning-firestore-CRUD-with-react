import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import styles from "./SignIn.module.css";

const SignInForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = (ev) => {
    ev.preventDefault();
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={onSubmitHandler}>
        <div className={styles["form-control"]}>
          <label htmlFor='email'>Email</label>
          <input ref={emailRef} type='text' name='email' placeholder='email' required />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor='password'>Password</label>
          <input ref={passwordRef} type='password' name='password' placeholder='password' required />
        </div>
        <button type='submit' disabled={isLoading}>
          Sign In
        </button>
        {error && <div>{error}</div>}
        <p>
          Don't have an account? <Link to='/signup'>Sign Up</Link>
        </p>
        <p>
          <Link to='/pw-forget'>Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
