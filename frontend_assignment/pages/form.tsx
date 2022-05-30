import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

export default function Form() {
  const formik = useFormik({
    initialValues: {
      userName: "",
      age: "",
      address: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .max(25, "Must be 25 characters or less")
        .required("Required"),
      age: Yup.number().positive().integer().required("Required"),
      address: Yup.string()
        .max(250, "Must be 250 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
      formik.handleReset({ values: "" });
    },
  });

  return (
    <>
      <br />
      <Container maxWidth="sm">
        <Paper elevation={24}>
          <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
              User Form
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="userName"
                    name="userName"
                    type="text"
                    label="User Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.userName}
                  />
                  {formik.touched.userName && formik.errors.userName ? (
                    <div>{formik.errors.userName}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="age"
                    name="age"
                    type="text"
                    label="Age"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                  />
                  {formik.touched.age && formik.errors.age ? (
                    <div>{formik.errors.age}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Address line"
                    autoComplete="address-line"
                    id="address"
                    name="address"
                    type="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div>{formik.errors.address}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Paper>
      </Container>
      <h4>
        <Link href="/">
          <a>Back to homepage</a>
        </Link>
      </h4>
    </>
  );
}
