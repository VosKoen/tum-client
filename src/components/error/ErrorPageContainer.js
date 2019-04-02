import * as React from "react";

import { connect } from "react-redux";
import ErrorPage from "./ErrorPage";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { resetError } from "../../actions/error";

class ErrorPageContainer extends React.PureComponent {
  state = {};

  componentWillUnmount = () => {
    this.props.resetError();
  };

  render() {
    const { classes } = this.props;
    if (!this.props.error) return <Redirect to="/" />;
    return <ErrorPage classes={classes} error={this.props.error}/>;
  }
}

const styles = theme => ({
    errorMessage: {
        margin: "auto",
        padding: theme.spacing.unit * 2,
        textAlign: "left"
      },
});

const mapStateToProps = state => ({
  error: state.error
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { resetError }
  )(ErrorPageContainer)
);
