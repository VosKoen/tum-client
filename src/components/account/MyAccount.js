import * as React from "react";
import { Paper, Divider, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export default function MyAccount(props) {
  const { user, state, handleChange, handleSubmitPassword, handleSubmitUserChange, classes } = props;

  return (
    <Paper className={classes.myAccount}>
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h4" align="left">
            Account details
          </Typography>
          <Divider />

          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <Typography align="left" variant="h6">
                Profile
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <form onSubmit={handleSubmitUserChange}>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  spacing={16}
                >
                  <Grid item>
                    <TextField
                      name="email"
                      type="email"
                      id="email"
                      value={state.emailAddress}
                      onChange={handleChange}
                      disabled
                      label="Email address"
                      variant="outlined"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="username"
                      type="text"
                      id="username"
                      value={state.username}
                      onChange={handleChange}
                      label="Username"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained" color="primary">
                      Save changes
                    </Button>
                    <Typography>{user.userSaveMessage}</Typography>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography align="left" variant="h6">
                Change password
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <form onSubmit={handleSubmitPassword}>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  spacing={16}
                >
                  <Grid item>
                    <TextField
                      name="password"
                      type="password"
                      id="password"
                      value={state.password}
                      onChange={handleChange}
                      label="Current password"
                      variant="outlined"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="newPassword"
                      type="password"
                      id="new-password"
                      value={state.newPassword}
                      onChange={handleChange}
                      label="New password"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="newPasswordConfirm"
                      type="password"
                      id="newPasswordConfirm"
                      value={state.newPasswordConfirm}
                      onChange={handleChange}
                      label="Confirm new password"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Typography>{user.resetPasswordFailMessage}</Typography>
                    <Typography>{user.resetPasswordSuccessMessage}</Typography>
                    <Button type="submit" variant="contained" color="primary">
                      Change password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Paper>
  );
}
