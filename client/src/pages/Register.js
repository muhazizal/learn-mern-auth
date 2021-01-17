import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Formik, Form, Field } from "formik";
import { Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import UserAxios from "../plugins/userAxios";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Form validation using Yup Schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Email Required"),
  password: Yup.string().min(5, "Your password must contain at least 5 characters").required("Password required"),
  passwordCheck: Yup.string()
    .min(5, "Your password must contain at least 5 characters")
    .required("Password check required")
    .oneOf([Yup.ref("password")], "You must input the same password"),
  displayName: Yup.string(),
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

export default function Register() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container direction='row' justify='center' alignItems='center'>
      <Grid item className={classes.gridItem}>
        <Typography variant='h2' className={classes.title}>
          Register Your Account
        </Typography>

        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordCheck: "",
            displayName: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);

            UserAxios.post("/register", values)
              .then(() => {
                handleOpen();
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
              <Field
                component={TextField}
                type='password'
                name='passwordCheck'
                label='Check Password'
                className={classes.field}
              />
              <Field
                component={TextField}
                type='text'
                name='displayName'
                label='Display Name'
                className={classes.field}
              />
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

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{"Register Success!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>{"Your account has been registered!"}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}
