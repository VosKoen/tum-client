import * as React from "react";
import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function MyAccount(props) {
  const { classes } = props;

  return (
    <Grid container justify="center">
    <Grid item>
      <Paper>
      <Typography component="h1" variant="h5">
            Account details
      </Typography>
      <Typography align="left">
            Email address
      </Typography>
      </Paper>
      </Grid>
    </Grid>
  );
}
