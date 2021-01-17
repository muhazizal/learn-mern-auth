import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AuthOptions from "./AuthOptions";

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontSize: 20,
    marginRight: "auto",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export default function TheHeader() {
  const classes = useStyles();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h1' className={classes.title}>
          <Link to='/' className={classes.link}>
            Todo App
          </Link>
        </Typography>
        <AuthOptions />
      </Toolbar>
    </AppBar>
  );
}
