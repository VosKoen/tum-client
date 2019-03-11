import * as React from "react";
import { Paper, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

export default function MyAccount(props) {
  const {  user, state, handleChange, handleSubmitPassword } = props;

  return (
    <Paper>
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Typography variant="h4" align="left">
            Account details
          </Typography>
          <Divider />

          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography align="left" variant="h6">Profile</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left">Email address</Typography>
              <Typography align="left">{user.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" variant="h6">Change password</Typography>
            </Grid>
            <Grid item xs={6}>
              <form onSubmit={handleSubmitPassword}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Current password</InputLabel>
                  <Input
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={state.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>New password</InputLabel>
                  <Input
                    name="newPassword"
                    type="password"
                    id="new-password"
                    value={state.newPassword}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>Confirm new password</InputLabel>
                  <Input
                    name="newPasswordConfirm"
                    type="password"
                    id="newPasswordConfirm"
                    value={state.newPasswordConfirm}
                    onChange={handleChange}
                  />
                </FormControl>
                <Grid container spacing={16} justify="flex-start">
                <Grid item>
                <Typography>{user.resetPasswordFailMessage}</Typography> 
                <Typography>{user.resetPasswordSuccessMessage}</Typography> 
                <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Change password
            </Button>
            </Grid>
            </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </Paper>
  );
}
