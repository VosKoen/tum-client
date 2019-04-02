import * as React from "react";
import { connect } from "react-redux";
import MyAccount from "./MyAccount";
import { withStyles } from "@material-ui/core/styles";
import { getAccountData, setNewPassword, submitUserChange } from "../../actions/users";
import { Redirect } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

//Alert definitions
const alertPasswordsNotSame = "alertPasswordsNotSame";

class MyAccountContainer extends React.PureComponent {
  state = {
    password: "",
    newPassword: "",
    newPasswordConfirm: "",
    emailAddress: "",
    username: "",
    [alertPasswordsNotSame]: false
  };

  componentDidMount = async () => {
    await this.props.getAccountData();

    this.setState({
      emailAddress: this.props.user.email,
      username: this.props.user.username
    });
  };

  handleSubmitPassword = e => {
    e.preventDefault();

    //Alerts
    if (this.state.newPassword !== this.state.newPasswordConfirm) {
      this.openAlert(alertPasswordsNotSame);
      return undefined;
    }
    this.props.setNewPassword(this.state.password, this.state.newPassword);
  };

  handleSubmitUserChange = e => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      email: this.state.emailAddress
    }
    this.props.submitUserChange(user);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  closeAlert = alertName => {
    this.setState({
      [alertName]: false
    });
  };

  openAlert = alertName => {
    this.setState({
      [alertName]: true
    });
  };

  renderPasswordNotTheSameAlert = () => {
    return (
      <Dialog
        open={this.state.alertPasswordsNotSame}
        onClose={() => this.closeAlert(alertPasswordsNotSame)}
      >
        <DialogContent>
          <DialogContentText>
            The password in "Confirm new password" is not the same as the
            password in 'New password'
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.closeAlert(alertPasswordsNotSame)}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    if (this.props.error) return <Redirect to="/error" />;
    if (!this.props.user) return <Redirect to="/logon" />;

    return (
      <div>
        <MyAccount
          user={this.props.user}
          state={this.state}
          handleSubmitPassword={this.handleSubmitPassword}
          handleChange={this.handleChange}
          handleSubmitUserChange={this.handleSubmitUserChange}
          classes={this.props.classes}
        />
        {this.renderPasswordNotTheSameAlert()}
      </div>
    );
  }
}

const styles = theme => ({
  myAccount: {
    margin: "auto",
    padding: theme.spacing.unit * 2
  }
});

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getAccountData, setNewPassword, submitUserChange }
  )(MyAccountContainer)
);
