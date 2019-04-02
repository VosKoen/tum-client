import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

export default function ErrorPage(props) {
  const { error, classes } = props;
  return (
    <div className={classes.errorMessage}>
      <Grid container spacing={32} direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h3" align='center'>Oops, something went wrong!</Typography>
        </Grid>
        <Grid item>
          <Typography align='center'>
            Something went wrong with the action you tried to perform. If the
            problem persists please contact us with the following error
            information:
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4" align='center'>
            {error.statusCode} - {error.statusText}
          </Typography>
        </Grid>
        <Grid item>
          <Typography align='center'>{error.message}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}
