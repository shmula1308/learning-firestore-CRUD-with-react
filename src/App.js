import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing/LandingPage";
import SignInForm from "./components/SignIn/SignIn";
import SignUpForm from "./components/SignUp/SignUp";
import VerifyEmailPage from "./components/VerifyEmail/VerifyEmail";
import HomePage from "./components/Home/HomePage";

import ProtectedRoute from "./components/RouteProtectors/ProtectedRoute";
import IsUserAuthenticated from "./components/RouteProtectors/isUserAuthenticated";

import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path='/homepage'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <IsUserAuthenticated>
              <LandingPage />
            </IsUserAuthenticated>
          }
        />
        <Route
          path='/signin'
          element={
            <IsUserAuthenticated>
              <SignInForm />
            </IsUserAuthenticated>
          }
        />
        <Route
          path='/signup'
          element={
            <IsUserAuthenticated>
              <SignUpForm />
            </IsUserAuthenticated>
          }
        />
        <Route
          path='/email/verify-email'
          element={
            <IsUserAuthenticated>
              <VerifyEmailPage />
            </IsUserAuthenticated>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
