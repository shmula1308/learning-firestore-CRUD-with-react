import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { auth } from "../Firebase/firebase";

const SignOutBtn = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const onSignOutHandler = () => {
    authCtx.signOut(auth);
    navigate("/signin", { replace: true });
  };

  return (
    <button type='button' onClick={onSignOutHandler}>
      Sign Out
    </button>
  );
};
export default SignOutBtn;
