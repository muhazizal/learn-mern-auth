import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function AuthOptions() {
  // Use browser history package
  const history = useHistory();

  // Set event handler on register and login
  const registerHandler = () => history.push("/register");
  const loginHandler = () => history.push("/login");

  return (
    <nav>
      <Button onClick={registerHandler} color='inherit'>
        Register
      </Button>
      <Button onClick={loginHandler} color='inherit'>
        Login
      </Button>
    </nav>
  );
}
