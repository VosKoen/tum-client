import * as React from "react";
import { connect } from "react-redux";
import RecipeView from "./RecipeView";
import { withStyles } from "@material-ui/core/styles";

import { getRandomRecipe } from "../../actions/recipes";

class RecipeViewContainer extends React.PureComponent {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div>
        <RecipeView recipe={this.props.recipe} classes={classes} />
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    maxWidth: '80%',
    margin: 'auto'},
  recipeImage: {},
  recipeDescription: {

  },
  recipeIngredients: {
  },
  recipeSteps: {}
});

const mapStateToProps = state => ({
  recipe: state.recipe
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getRandomRecipe }
  )(RecipeViewContainer)
);
