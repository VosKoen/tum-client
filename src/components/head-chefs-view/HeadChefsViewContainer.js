import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import HeadChefsView from "./HeadChefsView";

class HeadChefsViewContainer extends React.PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    if (this.props.error) return <Redirect to="/error" />;
    if (!this.props.user) return <Redirect to="/logon" />;

    return <HeadChefsView />;
  }
}

const styles = theme => ({});

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {}
  )(HeadChefsViewContainer)
);
