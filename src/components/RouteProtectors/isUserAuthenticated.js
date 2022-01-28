import { Fragment, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

// A wrapper component
const IsUserAuthenticated = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  // because for a second currentUser is null we get to see signin or signup page. Once it's populated it's redirected to Home
  useEffect(() => {
    if (authCtx.authUser) {
      navigate("/homepage", { replace: true });
    }
  }, [authCtx.authUser, navigate]);

  return <Fragment>{children}</Fragment>;
};

export default IsUserAuthenticated;
