import * as React from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import { logout } from "../../actions/users";
import { getRandomRecipe } from "../../actions/recipes";

class NavContainer extends React.PureComponent {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickLogout = () => {
    this.props.dispatch(logout());
    this.handleClose();
  };

  handleClickRandomRecipe = () => {
    this.props.getRandomRecipe();
    this.handleClose();
  };

  render() {
    const { classes } = this.props;

    if (this.props.user)
      return (
        <Navbar
          classes={classes}
          handleClick={this.handleClick}
          handleClose={this.handleClose}
          handleClickLogout={this.handleClickLogout}
          anchorEl={this.state.anchorEl}
          handleClickRandomRecipe={this.handleClickRandomRecipe}
        />
      );
    return <div />;
  }
}

const styles = theme => ({
  header: {
    fontFamily: ["Indie Flower", "cursive"].join(","),
    fontSize: 80,
    color: "white",
    margin: "auto"
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getRandomRecipe }
  )(NavContainer)
);
