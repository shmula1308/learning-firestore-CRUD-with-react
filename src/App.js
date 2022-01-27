import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing/LandingPage";
import SignInForm from "./components/SignIn/SignIn";
import SignUpForm from "./components/SignUp/SignUp";

import styles from "./App.module.css";
import HomePage from "./components/Home/HomePage";

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/signup' element={<SignUpForm />} />
      </Routes>
    </div>
  );
};

export default App;
