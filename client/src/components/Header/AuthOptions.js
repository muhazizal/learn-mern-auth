import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import UserContext from "../../context/userContext";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  // Use browser history package
  const history = useHistory();

  // Set event handler on register, login and logout
  const registerHandler = () => history.push("/register");
  const loginHandler = () => history.push("/login");
  const logoutHandler = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };

  return (
    <nav>
      {userData.user ? (
        <Button onClick={logoutHandler} color='inherit'>
          Logout
        </Button>
      ) : (
        <>
          <Button onClick={registerHandler} color='inherit'>
            Register
          </Button>
          <Button onClick={loginHandler} color='inherit'>
            Login
          </Button>
        </>
      )}
    </nav>
  );
}
