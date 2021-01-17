import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Formik, Form, Field } from "formik";
import { Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import UserContext from "../context/userContext";
import UserAxios from "../plugins/userAxios";

// Form validation using Yup Schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Email Required"),
  password: Yup.string().min(5, "Your password must contain at least 5 characters").required("Password required"),
});

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  field: {
    width: "100%",
    maxWidth: 250,
    marginBottom: theme.spacing(1),
  },
  button: {
    width: "100%",
    maxWidth: 250,
    marginTop: theme.spacing(3),
  },
  gridItem: {
    minWidth: 250,
  },
}));

export default function Login() {
  const classes = useStyles();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  return (
    <Grid container direction='row' justify='center' alignItems='center'>
      <Grid item className={classes.gridItem}>
        <Typography variant='h2' className={classes.title}>
          Login Your Account
        </Typography>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);

            const loginData = values;
            UserAxios.post("/login", loginData)
              .then((response) => {
                setUserData({
                  token: response.data.token,
                  user: response.data.user,
                });

                localStorage.setItem("auth-token", response.data.token);
                history.push("/");
              })
              .catch((error) => {
                console.log(error);
              });

            setSubmitting(false);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field component={TextField} type='email' name='email' label='Email' className={classes.field} />
              <Field component={TextField} type='password' name='password' label='Password' className={classes.field} />
              <Button
                variant='contained'
                color='primary'
                disabled={isSubmitting}
                onClick={submitForm}
                className={classes.button}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}
