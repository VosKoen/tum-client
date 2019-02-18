import * as React from "react";
import { connect } from "react-redux";
import MyRecipesView from "./MyRecipesView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import { getMyRecipes, openRecipe } from "../../actions/recipes";

class MyRecipesViewContainer extends React.PureComponent {
  state = {
    recipeOpened: false
  };

  componentDidMount() {
    if (this.props.user) this.props.getMyRecipes();
  }

  handleClickRecipe = async recipeId => {
    await this.props.openRecipe(recipeId);
    this.setState({
      recipeOpened: true
    });
  };

  render() {
    const { classes, myRecipes } = this.props;
    if (!this.props.user) return <Redirect to="/logon" />;
    if (this.state.recipeOpened) return <Redirect to="/" />;

    return (
      <MyRecipesView
        myRecipes={myRecipes}
        classes={classes}
        handleClickRecipe={this.handleClickRecipe}
      />
    );
  }
}

const styles = theme => ({
  myRecipes: {
    width: "80%",
    margin: "auto"
  },
  myRecipesHeader: {
    display: "flex",
    justifyContent: "space-between"
  }
});

const mapStateToProps = state => ({
  myRecipes: state.myRecipes,
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getMyRecipes, openRecipe }
  )(MyRecipesViewContainer)
);
