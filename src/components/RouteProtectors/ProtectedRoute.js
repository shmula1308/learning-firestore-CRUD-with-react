import { Fragment, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (!authCtx.authUser) {
      navigate("/signin", { replace: true });
    }
  }, [authCtx.authUser, navigate]);

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
