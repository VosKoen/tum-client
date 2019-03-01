import * as React from "react";
import { connect } from "react-redux";
import MyRecipesView from "./MyRecipesView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import {
  getMyRecipes,
  openRecipe,
  resetRecipeForm,
  getMyRecipeHistory,
  openSelectedRecipe
} from "../../actions/recipes";

class MyRecipesViewContainer extends React.PureComponent {
  state = {
    recipeOpened: false,
    addNewRecipeClicked: false
  };

  componentDidMount() {
    this.props.getMyRecipes();
    this.props.getMyRecipeHistory();
  }

  handleClickRecipe = async recipeId => {
    await this.props.openRecipe(recipeId);
    this.setState({
      recipeOpened: true
    });
  };

  handleClickNewRecipe = () => {
    this.props.resetRecipeForm();
    this.setState({ addNewRecipeClicked: true });
  };

  handleClickRecipeHistory = async recipeId => {
    await this.props.openSelectedRecipe(recipeId);

    this.setState({
      recipeOpened: true
    });
  };

  render() {
    if (!this.props.user) return <Redirect to="/logon" />;
    if (this.state.recipeOpened) return <Redirect to="/" />;
    if (this.state.addNewRecipeClicked) return <Redirect to="/recipe-form" />;

    return (
      <MyRecipesView
        myRecipes={this.props.myRecipes}
        recipeHistory={this.props.recipeHistory}
        classes={this.props.classes}
        handleClickRecipe={this.handleClickRecipe}
        handleClickNewRecipe={this.handleClickNewRecipe}
        handleClickRecipeHistory={this.handleClickRecipeHistory}
      />
    );
  }
}

const styles = theme => ({
  myRecipes: {
    width: "95%",
    margin: "auto",
    padding: theme.spacing.unit * 2,
    textAlign: "left"
  },
  myRecipesHeader: {},
  buttonAddRecipeContainer: {
    textAlign: "right"
  }
});

const mapStateToProps = state => ({
  myRecipes: state.myRecipes,
  user: state.user,
  recipeHistory: state.recipeHistory
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {
      getMyRecipes,
      openRecipe,
      resetRecipeForm,
      getMyRecipeHistory,
      openSelectedRecipe
    }
  )(MyRecipesViewContainer)
);
