import * as React from "react";
import { connect } from "react-redux";
import RecipeView from "./RecipeView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { getRandomRecipe, selectRecipe } from "../../actions/recipes";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { setRating } from "../../actions/ratings";

class RecipeViewContainer extends React.PureComponent {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  handleRejection = () => {
    this.props.getRandomRecipe();
  };

  handleConfirmation = () => {
    this.props.selectRecipe(this.props.recipe.id);
  };

  handleRating = (recipeId, recipeIsLiked) => {
    this.props.setRating(recipeId, recipeIsLiked);
  };

  renderRecipeSelectButtons = () => {
    if (!this.props.recipe.isSelectedRecipe)
      return (
        <div>
          <Fab
            variant="extended"
            aria-label="Cook"
            color="primary"
            onClick={this.handleConfirmation}
          >
            Cook!
          </Fab>
          <Fab
            variant="extended"
            aria-label="Next recipe"
            color="primary"
            onClick={this.handleRejection}
          >
            Not today
          </Fab>
        </div>
      );
  };

  renderRecipeRating = () => {
    if (this.props.recipe.isSelectedRecipe)
      return (
        <div>
          <IconButton
            disabled={this.props.recipe.recipeIsLiked === true}
            aria-label="Thumbs up"
            color="primary"
            onClick={() => this.handleRating(this.props.recipe.id, true)}
          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton
            disabled={this.props.recipe.recipeIsLiked === false}
            aria-label="Thumbs down"
            color="primary"
            onClick={() => this.handleRating(this.props.recipe.id, false)}
          >
            <ThumbDownIcon />
          </IconButton>
        </div>
      );
  };

  render() {
    const { classes } = this.props;
    if (!this.props.user) return <Redirect to="/logon" />;
    return (
      <div>
        <RecipeView
          recipe={this.props.recipe}
          classes={classes}
          renderRecipeSelectButtons={this.renderRecipeSelectButtons}
          renderRecipeRating={this.renderRecipeRating}
        />
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    maxWidth: "80%",
    margin: "auto"
  },
  recipeImage: {
    maxWidth: "50%",
    height: "100%"
  },
  recipeDescription: {
    display: "flex"
  },
  descriptionContent: {},
  recipeIngredients: {},
  recipeSteps: {}
});

const mapStateToProps = state => ({
  recipe: state.recipe,
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getRandomRecipe, selectRecipe, setRating }
  )(RecipeViewContainer)
);
