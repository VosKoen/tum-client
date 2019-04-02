import * as React from "react";
import { connect } from "react-redux";
import RecipeView from "./RecipeView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import {
  getRandomRecipe,
  selectRecipe,
  deleteRecipe,
  openEditRecipeForm,
  addPhotoToRecipe,
  clearPhotoFromRecipe,
  resetRecipeView
} from "../../actions/recipes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import RefreshIcon from "@material-ui/icons/Refresh";
import TuneIcon from "@material-ui/icons/Tune";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { setRating } from "../../actions/ratings";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { Grid, IconButton } from "@material-ui/core";
import FilterDialogContainer from "../filter-dialog/FilterDialogContainer";
import { resizeImage } from "../../image-processing/imageProcessing";
import { sizeLoadingSymbol } from "../../constants";
import ClearIcon from "@material-ui/icons/Clear";
import { setComponentRecipeView } from "../../actions/activeComponents";

import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

//Alert definitions
export const alertDeleteAreYouSure = "alertDeleteAreYouSure";

class RecipeViewContainer extends React.PureComponent {
  state = {
    [alertDeleteAreYouSure]: false,
    redirectToRecipeForm: false,
    openFilterDialog: false,
    imageIsLoading: false
  };

  componentDidMount() {
    this.props.setComponentRecipeView(true);
    if (!this.props.recipe.id) this.props.getRandomRecipe();
  }

  componentWillUnmount() {
    this.props.setComponentRecipeView(false);
    this.props.resetRecipeView();
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

  handleUploadImage = e => {
    const image = e.target.files[0];

    this.setState({
      imageIsLoading: true
    });

    resizeImage(image, this.storeImage);
  };

  handleClearImage = () => {
    this.props.clearPhotoFromRecipe(this.props.recipe.id);
  };

  storeImage = async (image, imageUrl) => {
    await this.props.addPhotoToRecipe(this.props.recipe.id, image);

    this.setState({
      imageIsLoading: false
    });
  };

  toggleFilterDialog = () => {
    this.setState({
      openFilterDialog: !this.state.openFilterDialog
    });
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
        <Grid
          container
          spacing={16}
          className={this.props.classes.recipeButtons}
        >
          <Grid item xs={3} />
          <Grid item xs={2}>
            <IconButton
              aria-label="Cook"
              onClick={this.handleConfirmation}
              className={this.props.classes.recipeCookButton}
            >
              <RestaurantIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="Add filter"
              onClick={this.toggleFilterDialog}
              className={this.props.classes.recipeFilterButton}
            >
              <TuneIcon />
            </IconButton>
          </Grid>

          <Grid item xs={2}>
            <IconButton
              aria-label="Load new recipe"
              onClick={this.handleRejection}
              className={this.props.classes.recipeNextButton}
            >
              <RefreshIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      );
  };

  renderRecipeRating = () => {
    if (this.props.recipe.isSelectedRecipe)
      return (
        <Grid
          container
          spacing={16}
          className={this.props.classes.recipeButtons}
        >
          <Grid item xs={3} />
          <Grid item xs={3}>
            <IconButton
              disabled={this.props.recipe.recipeIsLiked === true}
              aria-label="Thumbs up"
              onClick={() => this.handleRating(this.props.recipe.id, true)}
              className={this.props.classes.ratingButtonPlus}
            >
              <ThumbUpIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={3}
            className={this.props.classes.recipeActionButtonRight}
          >
            <IconButton
              disabled={this.props.recipe.recipeIsLiked === false}
              aria-label="Thumbs down"
              onClick={() => this.handleRating(this.props.recipe.id, false)}
              className={this.props.classes.ratingButtonMinus}
            >
              <ThumbDownIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      );
  };

  renderPhotoButton = () => {
    if (this.props.recipe.isSelectedRecipe)
      return (
        <div className={this.props.classes.photoButtonContainer}>
          {!this.props.recipe.recipeImageFromUser ? (
            <IconButton
              aria-label="Add a photo"
              color="primary"
              onChange={this.handleUploadImage}
              component="label"
              className={this.props.classes.photoButton}
            >
              <input accept="image/*" type="file" style={{ display: "none" }} />
              <AddAPhotoIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="Remove photo"
              color="primary"
              onClick={this.handleClearImage}
              component="label"
              className={this.props.classes.photoButton}
            >
              <ClearIcon />
            </IconButton>
          )}
        </div>
      );
  };

  renderEditDeleteButtons = () => {
    if (this.props.recipe.isOpenedRecipe)
      return (
        <Grid
          container
          spacing={16}
          className={this.props.classes.recipeButtons}
        >
          <Grid item xs={3} />
          <Grid item xs={3}>
            <IconButton
              aria-label="Edit recipe"
              onClick={this.handleEditRecipe}
              className={this.props.classes.editDeleteButtons}
            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={3}
            className={this.props.classes.recipeActionButtonRight}
          >
            <IconButton
              onClick={() => this.openAlert(alertDeleteAreYouSure)}
              className={this.props.classes.editDeleteButtons}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3} />
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
    if (this.props.error) return <Redirect to="/error" />;
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
          renderPhotoButton={this.renderPhotoButton}
          state={this.state}
        />
        {this.renderDeleteAlert()}
        <FilterDialogContainer
          open={this.state.openFilterDialog}
          close={this.toggleFilterDialog}
        />
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    margin: "auto",
    padding: theme.spacing.unit * 2
  },
  ratingButtonPlus: {
    ...theme.flatRoundIconButton,
    "&:disabled": {
      color: "white",
      backgroundColor: green["A700"]
    },
    "&:hover": {
      color: "white",
      backgroundColor: green["A700"]
    },
    // For Mobile, hover has to be added as well. The state immediately after clicking is hover and disabled:
    "&:hover&:disabled": {
      color: "white",
      backgroundColor: green["A700"]
    },
    color: "white",
    backgroundColor: green[200]
  },

  ratingButtonMinus: {
    ...theme.flatRoundIconButton,
    "&:disabled": {
      color: "white",
      backgroundColor: red["500"]
    },
    "&:hover": {
      color: "white",
      backgroundColor: red["500"]
    },
    // For Mobile, hover has to be added as well. The state immediately after clicking is hover and disabled:
    "&:hover&:disabled": {
      color: "white",
      backgroundColor: red["500"]
    },
    color: "white",
    backgroundColor: red[200]
  },

  imageContainer: {
    position: "relative",
    width: "100%"
  },
  photoButtonContainer: {
    position: "absolute",
    right: "16px",
    top: "16px"
  },
  photoButton: theme.flatRoundIconButton,
  recipeButtons: {
    position: "absolute",
    bottom: "16px",
    left: "8px",
    width: "100%"
  },
  menuHeader: {
    color: "black"
  },
  loadingSymbol: {
    position: "absolute",
    right: "50%",
    marginRight: `-${sizeLoadingSymbol / 2}px`,
    top: "50%",
    marginTop: `-${sizeLoadingSymbol / 2}px`
  },
  recipeCookButton: {
    ...theme.flatRoundIconButton,
    backgroundColor: green["A700"],
    "&:hover": {
      backgroundColor: green["A700"],
    }
  },
  recipeFilterButton: theme.flatRoundIconButton,
  recipeNextButton: theme.flatRoundIconButton,
  editDeleteButtons: theme.flatRoundIconButton
});

const mapStateToProps = state => ({
  recipe: state.recipe,
  user: state.user,
  error: state.error
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {
      getRandomRecipe,
      selectRecipe,
      setRating,
      deleteRecipe,
      openEditRecipeForm,
      addPhotoToRecipe,
      clearPhotoFromRecipe,
      setComponentRecipeView,
      resetRecipeView
    }
  )(RecipeViewContainer)
);
