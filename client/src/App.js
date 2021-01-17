import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TheHeader from "./components/Header/TheHeader";
import UserContext from "./context/userContext";
import UserAxios from "./plugins/userAxios";

import "./styles/style-reset.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  // Set userData and setUserData hooks state
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  // Use hooks effect to catch event outside this component
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      // Check token on local storage
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      // Check is token valid
      const isTokenValid = await UserAxios.post("/isTokenValid", null, {
        headers: {
          "x-auth-token": token,
        },
      });

      // Check is data available
      if (isTokenValid.data) {
        const userResponse = await UserAxios.get("/", {
          headers: {
            "x-auth-token": token,
          },
        });

        // Set user data on user context
        setUserData({
          token,
          user: userResponse.data,
        });
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <div className={classes.root}>
            <TheHeader />

            <main>
              <Container fixed className={classes.container}>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/login' component={Login} />
                  <Route path='/register' component={Register} />
                </Switch>
              </Container>
            </main>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}
