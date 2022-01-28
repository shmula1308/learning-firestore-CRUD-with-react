import React, { useRef, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import styles from "./SignIn.module.css";

const SignInForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const onSubmitHandler = async (ev) => {
    ev.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    try {
      setError("");
      setError(true);
      await authCtx.signIn(auth, email, password);
      navigate("/homepage");
    } catch (error) {
      setError(error.message);
      setIsloading(false);
    }
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
