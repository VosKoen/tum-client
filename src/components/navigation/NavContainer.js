import * as React from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import { logoutUser } from "../../actions/users";
import { getRandomRecipe } from "../../actions/recipes";
import { Redirect } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";

import { componentRecipeView } from "../../actions/activeComponents";

class NavContainer extends React.PureComponent {
  state = {
    anchorEl: null,
    redirectMyAccount: false,
    redirectRandomRecipe: false,
    redirectMyRecipes: false
  };

  componentDidUpdate() {
    this.setState({
      redirectMyRecipes: false,
      redirectMyAccount: false,
      redirectRandomRecipe: false
    });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickLogout = () => {
    this.props.logoutUser();
    this.handleClose();
  };

  handleClickRandomRecipe = () => {
    this.props.getRandomRecipe();
    this.setState({ redirectRandomRecipe: true });
    this.handleClose();
  };

  handleClickMyRecipes = () => {
    this.setState({ redirectMyRecipes: true });
    this.handleClose();
  };

  handleClickMyAccount = () => {
    this.setState({ redirectMyAccount: true });
    this.handleClose();
  };

  renderReportButtons = () => {
    const { classes } = this.props;
    if (this.props.activeComponents[componentRecipeView])
      return (
        <Grid container justify="flex-end">
          {this.props.recipe.isOpenedRecipe ? (
            ""
          ) : (
            <Button
              className={classes.appBarButton}
              onClick={() => console.log("report recipe")}
            >
              Report recipe
            </Button>
          )}
          <Button
            className={classes.appBarButton}
            onClick={() => console.log("report image")}
            disabled={this.props.recipe.recipeImageFromUser}
          >
            Report image
          </Button>
        </Grid>
      );

    return;
  };

  render() {
    const { classes } = this.props;

    if (this.props.user)
      return (
        <div>
          <Navbar
            classes={classes}
            handleClick={this.handleClick}
            handleClose={this.handleClose}
            handleClickLogout={this.handleClickLogout}
            anchorEl={this.state.anchorEl}
            handleClickRandomRecipe={this.handleClickRandomRecipe}
            handleClickMyAccount={this.handleClickMyAccount}
            handleClickMyRecipes={this.handleClickMyRecipes}
            renderReportButtons={this.renderReportButtons}
          />
          {this.state.redirectRandomRecipe ? (
            <Redirect to="/" />
          ) : this.state.redirectMyRecipes ? (
            <Redirect to="/my-recipes" />
          ) : this.state.redirectMyAccount ? (
            <Redirect to="/my-account" />
          ) : (
            ""
          )}
        </div>
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
  },
  appBarButton: {
    color: "white"
  }
});

const mapStateToProps = state => ({
  user: state.user,
  activeComponents: state.activeComponents,
  recipe: state.recipe
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getRandomRecipe, logoutUser }
  )(NavContainer)
);
