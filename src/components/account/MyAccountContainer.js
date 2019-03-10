import * as React from "react";
import { connect } from "react-redux";
import MyAccount from "./MyAccount";
import { withStyles } from "@material-ui/core/styles";


class MyAccountContainer extends React.PureComponent {
  state = {
  };

  render() {

return (
    <MyAccount />
)

  }
}

const styles = theme => ({

});

const mapStateToProps = state => ({
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps
  )(MyAccountContainer)
);
