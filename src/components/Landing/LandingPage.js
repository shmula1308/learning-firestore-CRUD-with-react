import React from "react";
import { Link } from "react-router-dom";

import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landing}>
      <h1 className={styles.title}>Learning Firestore</h1>
      <div className={styles.actions}>
        <Link className={`${styles["btn-secondary"]} ${styles.btn}`} to='/signin'>
          Sign In
        </Link>
        <Link className={`${styles["btn-primary"]} ${styles.btn}`} to='/signup'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
