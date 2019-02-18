import * as React from "react";
import { connect } from "react-redux";
import RecipeView from "./RecipeView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { getRandomRecipe, selectRecipe, deleteRecipe, prefillRecipeForm } from "../../actions/recipes";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { setRating } from "../../actions/ratings";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

//Alert definitions
export const alertDeleteAreYouSure = "alertDeleteAreYouSure";

class RecipeViewContainer extends React.PureComponent {
  state = {
    [alertDeleteAreYouSure]: false,
    redirectToRecipeForm: false
  };

  componentDidMount() {
    if (!this.props.recipe.isOpenedRecipe) this.props.getRandomRecipe();
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

  handleEditRecipe = () => {
    this.props.prefillRecipeForm()
    this.setState({
      redirectToRecipeForm: true
    }); 
  };

  handleDeleteRecipe = () => {
    this.props.deleteRecipe(this.props.recipe.id)
    this.closeAlert(alertDeleteAreYouSure);
  };

  closeAlert = alertName => {
    this.setState({
      [alertName]: false
    });
  };

  openAlert = alertName => {

    this.setState({
      [alertName]: true
    });
  };

  renderRecipeSelectButtons = () => {
    if (
      !this.props.recipe.isSelectedRecipe &&
      !this.props.recipe.isOpenedRecipe
    )
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

  renderEditDeleteButtons = () => {
    if (this.props.recipe.isOpenedRecipe)
      return (
        <div>
          <IconButton
            aria-label="edit recipe"
            color="primary"
            onClick={this.handleEditRecipe}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete recipe"
            color="primary"
            onClick={() => this.openAlert(alertDeleteAreYouSure)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      );
  };

  renderDeleteAlert = () => {

      return (
        <Dialog
          open={this.state.alertDeleteAreYouSure}
          onClose={() => this.closeAlert(alertDeleteAreYouSure)}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this recipe? Once deleted a recipe
              cannot be restored.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteRecipe} color="primary">
              Yes, delete
            </Button>
            <Button
              onClick={() => this.closeAlert(alertDeleteAreYouSure)}
              color="primary"
              autoFocus
            >
              No, cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
  };

  render() {
    const { classes } = this.props;
    if (!this.props.user) return <Redirect to="/logon" />;
    if (this.props.recipe.deleteRecipeSuccess) return <Redirect to="/my-recipes" />;
    if (this.state.redirectToRecipeForm) return <Redirect to="/recipe-form" />;
    return (
      <div>
        <RecipeView
          recipe={this.props.recipe}
          classes={classes}
          renderRecipeSelectButtons={this.renderRecipeSelectButtons}
          renderRecipeRating={this.renderRecipeRating}
          renderEditDeleteButtons={this.renderEditDeleteButtons}
        />
        {this.renderDeleteAlert()}
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
    { getRandomRecipe, selectRecipe, setRating, deleteRecipe, prefillRecipeForm }
  )(RecipeViewContainer)
);
