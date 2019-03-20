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
  addPhotoToRecipe
} from "../../actions/recipes";
import Fab from "@material-ui/core/Fab";

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
import { Grid } from "@material-ui/core";
import FilterDialogContainer from "../filter-dialog/FilterDialogContainer";
import { resizeImage } from "../../image-processing/imageProcessing";
import { sizeLoadingSymbol } from "../../constants";

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

  handleUploadImage = e => {
    const image = e.target.files[0];

    this.setState({
      imageIsLoading: true
    });

    resizeImage(image, this.storeImage);
  };

  storeImage = async (image, imageUrl) => {

  await this.props.addPhotoToRecipe(this.props.recipe.id, image)  

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
            <Fab
              aria-label="Cook"
              color="secondary"
              onClick={this.handleConfirmation}
              size="small"
            >
              <RestaurantIcon />
            </Fab>
          </Grid>
          <Grid item xs={2}>
            <Fab
              aria-label="Add filter"
              color="primary"
              onClick={this.toggleFilterDialog}
              size="small"
            >
              <TuneIcon />
            </Fab>
          </Grid>

          <Grid item xs={2}>
            <Fab
              aria-label="Load new recipe"
              color="primary"
              onClick={this.handleRejection}
              size="small"
            >
              <RefreshIcon />
            </Fab>
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
            <Fab
              disabled={this.props.recipe.recipeIsLiked === true}
              aria-label="Thumbs up"
              color="secondary"
              onClick={() => this.handleRating(this.props.recipe.id, true)}
              size="small"
              className={this.props.classes.ratingButtonPlus}
            >
              <ThumbUpIcon />
            </Fab>
          </Grid>
          <Grid
            item
            xs={3}
            className={this.props.classes.recipeActionButtonRight}
          >
            <Fab
              disabled={this.props.recipe.recipeIsLiked === false}
              aria-label="Thumbs down"
              color="primary"
              onClick={() => this.handleRating(this.props.recipe.id, false)}
              size="small"
              className={this.props.classes.ratingButtonMinus}
            >
              <ThumbDownIcon />
            </Fab>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      );
  };

  renderPhotoButton = () => {
    if (this.props.recipe.isSelectedRecipe)
      return (
        <div className={this.props.classes.photoButton}>
          <Fab
            aria-label="Add a photo"
            color="primary"
            onChange={this.handleUploadImage}
            size="small"
            component="label"
          >
            <input accept="image/*" type="file" style={{ display: "none" }} />
            <AddAPhotoIcon />
          </Fab>
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
            <Fab
              aria-label="Edit recipe"
              color="primary"
              onClick={this.handleEditRecipe}
              size="small"
            >
              <EditIcon />
            </Fab>
          </Grid>
          <Grid
            item
            xs={3}
            className={this.props.classes.recipeActionButtonRight}
          >
            <Fab
              aria-label="Delete recipe"
              color="primary"
              onClick={() => this.openAlert(alertDeleteAreYouSure)}
              size="small"
            >
              <DeleteIcon />
            </Fab>
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
    "&:disabled": {
      color: "white",
      backgroundColor: green["A700"]
    },
    color: "white",
    backgroundColor: green[200]
  },

  ratingButtonMinus: {
    "&:disabled": {
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
  photoButton: {
    position: "absolute",
    right: "16px",
    top: "16px"
  },
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
      openEditRecipeForm,
      addPhotoToRecipe
    }
  )(RecipeViewContainer)
);
