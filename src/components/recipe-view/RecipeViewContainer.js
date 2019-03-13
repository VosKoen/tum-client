import * as React from "react";
import { connect } from "react-redux";
import RecipeView from "./RecipeView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import {
  getRandomRecipe,
  selectRecipe,
  deleteRecipe,
  openEditRecipeForm
} from "../../actions/recipes";
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
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

//Alert definitions
export const alertDeleteAreYouSure = "alertDeleteAreYouSure";

class RecipeViewContainer extends React.PureComponent {
  state = {
    [alertDeleteAreYouSure]: false,
    redirectToRecipeForm: false
  };

  componentDidMount() {
    if (!this.props.recipe.id) this.props.getRandomRecipe();
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
    this.props.openEditRecipeForm();
    this.setState({
      redirectToRecipeForm: true
    });
  };

  handleDeleteRecipe = () => {
    this.props.deleteRecipe(this.props.recipe.id);
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
        <div className={this.props.classes.recipeSelectButtonsContainer}>
        <Grid container spacing={16}  className={this.props.classes.recipeSelectButtons}>
          <Grid
            item
            xs={6}
            className={this.props.classes.recipeActionButtonLeft}
          >
            <Fab
              variant="extended"
              aria-label="Cook"
              color="primary"
              onClick={this.handleConfirmation}
            >
              Cook!
            </Fab>
          </Grid>
          <Grid
            item
            xs={6}
            className={this.props.classes.recipeActionButtonRight}
          >
            <Fab
              variant="extended"
              aria-label="Next recipe"
              color="primary"
              onClick={this.handleRejection}
            >
              Not today
            </Fab>
          </Grid>
        </Grid>
        </div>
      );
  };

  renderRecipeRating = () => {
    if (this.props.recipe.isSelectedRecipe)
      return (
        <Grid container direction="row" spacing={16}>
          <Grid
            item
            xs={5}
            className={this.props.classes.recipeActionButtonLeft}
          >
            <IconButton
              disabled={this.props.recipe.recipeIsLiked === true}
              aria-label="Thumbs up"
              color="primary"
              onClick={() => this.handleRating(this.props.recipe.id, true)}
              className={this.props.classes.ratingButton}
            >
              <ThumbUpIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <div
              className={
                this.props.recipe.rating > 0
                  ? this.props.classes.ratingPositive
                  : this.props.recipe.rating < 0
                  ? this.props.classes.ratingNegative
                  : this.props.classes.ratingNeutral
              }
            >
              <Typography color="inherit">
                {!this.props.recipe.rating
                  ? 0
                  : this.props.recipe.rating > 0
                  ? `+${this.props.recipe.rating}`
                  : this.props.recipe.rating}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={5}
            className={this.props.classes.recipeActionButtonRight}
          >
            <IconButton
              disabled={this.props.recipe.recipeIsLiked === false}
              aria-label="Thumbs down"
              color="primary"
              onClick={() => this.handleRating(this.props.recipe.id, false)}
              className={this.props.classes.ratingButton}
            >
              <ThumbDownIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
  };

  renderEditDeleteButtons = () => {
    if (this.props.recipe.isOpenedRecipe)
      return (
        <Grid container direction="column" spacing={16}>
          <Grid
            item
            className={
              this.props.recipe.rating > 0
                ? this.props.classes.ratingPositive
                : this.props.recipe.rating < 0
                ? this.props.classes.ratingNegative
                : this.props.classes.ratingNeutral
            }
          >
            <Typography color="inherit">
              {!this.props.recipe.rating
                ? 0
                : this.props.recipe.rating > 0
                ? `+${this.props.recipe.rating}`
                : this.props.recipe.rating}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={16}>
              <Grid
                item
                xs={6}
                className={this.props.classes.recipeActionButtonLeft}
              >
                <IconButton
                  aria-label="edit recipe"
                  color="primary"
                  onClick={this.handleEditRecipe}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={6}
                className={this.props.classes.recipeActionButtonRight}
              >
                <IconButton
                  aria-label="delete recipe"
                  color="primary"
                  onClick={() => this.openAlert(alertDeleteAreYouSure)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
    if (this.props.recipe.deleteRecipeSuccess)
      return <Redirect to="/my-recipes" />;
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
    margin: "auto",
    padding: theme.spacing.unit * 2
  },
  recipeActionButtonLeft: {
    textAlign: "right"
  },
  recipeActionButtonRight: {
    textAlign: "left"
  },
  ratingButton: {
    "&:disabled": {
      color: "red"
    },
    color: "lightcoral"
  },
  ratingPositive: {
    color: "green"
  },
  ratingNegative: {
    color: "red"
  },
  ratingNeutral: {
    color: "black"
  },
  recipeSelectButtonsContainer: {
    position: "relative",
    width: "100%",
  },
  recipeSelectButtons: {
    position: "absolute",
    bottom: "16px",
    width: "100%"
  },
});

const mapStateToProps = state => ({
  recipe: state.recipe,
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {
      getRandomRecipe,
      selectRecipe,
      setRating,
      deleteRecipe,
      openEditRecipeForm
    }
  )(RecipeViewContainer)
);
