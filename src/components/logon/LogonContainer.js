import * as React from "react";
import { connect } from "react-redux";
import { login } from "../../actions/users";
import Logon from "./Logon";
import { Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

class LogonContainer extends React.PureComponent {

  state = { email: "", password: "" };

  handleSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    if (this.props.error) return <Redirect to="/error" />;
    if (this.props.user) return <Redirect to="/" />;

    return (
      <Logon
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        state={this.state}
        classes={this.props.classes}
        error={this.props.loginError}
      />
    );
  }
}

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

const mapStateToProps = state => ({
  user: state.user,
  loginError: state.login.error,
  error: state.error
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { login }
  )(LogonContainer)
);
