import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import RecipeForm from "./RecipeForm";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { sizeLoadingSymbol, imagePlaceholder } from "../../constants";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  addIngredientToRecipe,
  removeIngredientFromRecipe,
  addStepToRecipe,
  removeStepFromRecipe,
  addRecipe,
  resetRecipeForm,
  changeRecipeIngredient,
  changeRecipeStep,
  saveChangesRecipe
} from "../../actions/recipes";
import {
  getIngredientList,
  submitNewIngredientRequest
} from "../../actions/ingredients";
import { Redirect } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { userId } from "../../jwt";

import CircularProgress from "@material-ui/core/CircularProgress";
import { resizeImage } from "../../image-processing/imageProcessing";

//Alert definitions
import { alertIngredientAlreadyPresent } from "../../actions/recipes";
const alertNoSteps = "alertNoSteps";
const alertNoIngredients = "alertNoIngredients";
const alertImageRejected = "alertImageRejected";
const alertRequestIngredientSubmitted = "alertRequestIngredientSubmitted";
const alertChangeResetsRating = "alertChangeResetsRating";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, ingredientList) {
  const inputValue = deburr(value.trim()).toLowerCase();

  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : ingredientList.filter(suggestion => {
        const keep =
          count < 15 &&
          deburr(suggestion.name.toLowerCase()).indexOf(inputValue) !== -1;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

class RecipeFormContainer extends React.PureComponent {
  state = {
    suggestions: [],
    ingredientOpen: false,
    ingredient: "",
    nosuggestions: false,
    ingredientSelected: false,
    amount: "",
    stepOpen: false,
    cancelSubmit: false,
    submitRecipe: false,
    recipeTitle: "",
    recipeDescription: "",
    [alertIngredientAlreadyPresent]: false,
    [alertNoSteps]: false,
    [alertNoIngredients]: false,
    [alertImageRejected]: false,
    [alertRequestIngredientSubmitted]: false,
    [alertChangeResetsRating]: false,
    imageFile: null,
    imageUrl: this.props.myRecipe.imageUrl,
    imageIsLoading: false,
    requestIngredientOpen: false,
    newIngredient: "",
    servings: "",
    preparationTime: "",
    submitIsLoading: false,
    removeOwnImage: false
  };

  componentDidMount = () => {
    this.props.getIngredientList();

    if (this.props.myRecipe.editMode)
      this.setState({
        recipeTitle: this.props.recipe.title,
        recipeDescription: this.props.recipe.description,
        servings: this.props.recipe.servings,
        preparationTime: this.props.recipe.timeNeeded
      });
  };

  handleIngredientSelected = value => {
    let ingredientSelected = false;
    const suggestions = getSuggestions(
      value,
      this.props.referenceData.ingredients
    );

    if (
      suggestions.length > 0 &&
      suggestions.find(
        suggestion => suggestion.name.toLowerCase() === value.toLowerCase()
      )
    )
      ingredientSelected = true;

    this.setState({
      ingredientSelected
    });
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(
      value,
      this.props.referenceData.ingredients
    );

    this.setState({
      suggestions,
      nosuggestions: suggestions.length === 0 && value.length > 0
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleIngredientOpen = () => {
    this.setState({
      ingredientOpen: true,
      suggestions: [],
      ingredient: "",
      nosuggestions: false,
      ingredientSelected: false,
      amount: "",
      isIngredientEditMode: false
    });
  };

  handleIngredientClose = () => {
    this.setState({ ingredientOpen: false, ingredient: "" });
  };

  handleIngredientSelect = arrayIndex => {
    const selectedIngredient = this.props.myRecipe.ingredients[arrayIndex];
    this.setState({
      ingredientOpen: true,
      suggestions: [],
      ingredient: selectedIngredient.name,
      nosuggestions: false,
      ingredientSelected: true,
      amount: selectedIngredient.amount,
      isIngredientEditMode: true,
      arrayIndexSelectedIngredient: arrayIndex
    });
  };

  handleIngredientAdd = () => {
    const ingredient = {
      ingredientId: this.props.referenceData.ingredients.find(
        ingredient => ingredient.name === this.state.ingredient
      ).id,
      amount: this.state.amount,
      name: this.state.ingredient
    };

    const alert = this.props.addIngredientToRecipe(ingredient);
    if (alert) {
      return this.openAlert(alert);
    }

    this.handleIngredientClose();
  };

  handleIngredientChange = () => {
    const ingredient = {
      ingredientId: this.props.referenceData.ingredients.find(
        ingredient => ingredient.name === this.state.ingredient
      ).id,
      amount: this.state.amount,
      name: this.state.ingredient
    };

    const alert = this.props.changeRecipeIngredient(
      ingredient,
      this.state.arrayIndexSelectedIngredient
    );
    if (alert) {
      return this.openAlert(alert);
    }

    this.handleIngredientClose();
  };

  handleIngredientDelete = id => {
    this.props.removeIngredientFromRecipe(id);
  };

  handleStepOpen = () => {
    this.setState({
      stepOpen: true,
      stepDescription: "",
      isStepEditMode: false
    });
  };

  handleStepClose = () => {
    this.setState({ stepOpen: false });
  };

  handleStepSelect = arrayIndex => {
    const selectedStep = this.props.myRecipe.steps[arrayIndex];
    this.setState({
      stepOpen: true,
      stepDescription: selectedStep.description,
      isStepEditMode: true,
      arrayIndexSelectedStep: arrayIndex
    });
  };

  handleStepAdd = () => {
    const step = {
      description: this.state.stepDescription
    };

    this.props.addStepToRecipe(step);
    this.handleStepClose();
  };

  handleStepChange = () => {
    const step = this.props.myRecipe.steps[this.state.arrayIndexSelectedStep];
    step.description = this.state.stepDescription;

    this.props.changeRecipeStep(step, this.state.arrayIndexSelectedStep);
    this.handleStepClose();
  };

  handleStepDelete = indexStepArray => {
    this.props.removeStepFromRecipe(indexStepArray);
  };

  handleSubmit = e => {
    e.preventDefault();

    //Alerts
    if (this.props.myRecipe.ingredients.length === 0) {
      this.openAlert(alertNoIngredients);
      return undefined;
    }

    if (this.props.myRecipe.steps.length === 0) {
      this.openAlert(alertNoSteps);
      return undefined;
    }

    if (this.props.myRecipe.editMode) {
      this.openAlert(alertChangeResetsRating);
      return undefined;
    }

    //If none of the alerts is triggered, the recipe can be submitted
    this.submitRecipe();
  };

  submitRecipe = async () => {
    this.setState({
      submitIsLoading: true
    });
    this.closeAlert(alertChangeResetsRating);

    const recipe = {
      title: this.state.recipeTitle,
      description: this.state.recipeDescription,
      timeNeeded: this.state.preparationTime,
      servings: this.state.servings,
      recipeIngredients: this.props.myRecipe.ingredients,
      steps: this.props.myRecipe.steps,
      id: this.props.myRecipe.id
    };

    const user = userId(this.props.user.jwt);

    if (this.props.myRecipe.editMode) {
      await this.props.saveChangesRecipe(
        recipe,
        this.state.imageFile,
        this.state.removeOwnImage
      );
    } else {
      await this.props.addRecipe(recipe, user, this.state.imageFile);
    }

    this.setState({ submitRecipe: true, submitIsLoading: false });
  };

  handleCancelSubmit = () => {
    this.setState({ cancelSubmit: true });

    this.props.resetRecipeForm();
  };

  handleAutosuggestChange = name => (event, { newValue }) => {
    this.handleIngredientSelected(newValue);

    this.setState({
      [name]: newValue
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

  handleImageAdd = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      this.openAlert(alertImageRejected);
      return;
    }

    this.setState({
      imageIsLoading: true
    });

    resizeImage(acceptedFiles[0], this.storeImage);
  };

  storeImage = async (image, imageUrl) => {
    this.setState({
      imageFile: image,
      imageUrl: imageUrl,
      imageIsLoading: false
    });
  };

  handleImageRemove = () => {
    this.setState({
      imageFile: null,
      imageUrl: imagePlaceholder,
      removeOwnImage: true
    });
  };

  renderImageRejectedAlert = () => {
    return (
      <Dialog
        open={this.state.alertImageRejected}
        onClose={() => this.closeAlert(alertImageRejected)}
      >
        <DialogContent>
          <DialogContentText>
            You can only upload images, no other filetypes are allowed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeAlert(alertImageRejected)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderNoStepsAlert = () => {
    return (
      <Dialog
        open={this.state.alertNoSteps}
        onClose={() => this.closeAlert(alertNoSteps)}
      >
        <DialogContent>
          <DialogContentText>
            Please add at least one step to the recipe before submitting
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeAlert(alertNoSteps)}>Ok</Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderNoIngredientsAlert = () => {
    return (
      <Dialog
        open={this.state.alertNoIngredients}
        onClose={() => this.closeAlert(alertNoIngredients)}
      >
        <DialogContent>
          <DialogContentText>
            Please add at least one ingredient to the recipe before submitting
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeAlert(alertNoIngredients)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderRequestIngredientSubmittedAlert = () => {
    return (
      <Dialog
        open={this.state.alertRequestIngredientSubmitted}
        onClose={() => this.closeAlert(alertRequestIngredientSubmitted)}
      >
        <DialogContent>
          <DialogContentText>
            Thank you for submitting your request for a new ingredient. Your
            request will be reviewed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.closeAlert(alertRequestIngredientSubmitted)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderChangeResetsRatingAlert = () => {
    return (
      <Dialog
        open={this.state.alertChangeResetsRating}
        onClose={() => this.closeAlert(alertChangeResetsRating)}
      >
        <DialogContent>
          <DialogContentText>
            Any changes in ingredients or in steps will reset the recipe rating.
            Are you sure you want to submit your changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.submitRecipe()}>Submit changes</Button>
          <Button onClick={() => this.closeAlert(alertChangeResetsRating)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleRequestIngredientOpen = () => {
    this.handleIngredientClose();
    this.setState({
      requestIngredientOpen: true
    });
  };

  handleRequestIngredientClose = () => {
    this.setState({
      requestIngredientOpen: false
    });
  };

  handleRequestIngredientSubmit = ingredient => {
    this.props.submitNewIngredientRequest(ingredient);
    this.handleRequestIngredientClose();
    this.setState({
      newIngredient: ""
    });
    this.openAlert(alertRequestIngredientSubmitted);
  };

  render() {
    const { classes, myRecipe } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };

    if (!this.props.user) return <Redirect to="/logon" />;
    if (this.state.cancelSubmit === true || this.state.submitRecipe === true)
      return <Redirect to="/my-recipes" />;

    return (
      <div>
        <RecipeForm
          classes={classes}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          state={this.state}
          myRecipe={myRecipe}
          autosuggestProps={autosuggestProps}
          handleIngredientOpen={this.handleIngredientOpen}
          handleIngredientClose={this.handleIngredientClose}
          handleAutosuggestChange={this.handleAutosuggestChange}
          handleIngredientAdd={this.handleIngredientAdd}
          handleStepOpen={this.handleStepOpen}
          handleStepClose={this.handleStepClose}
          handleStepAdd={this.handleStepAdd}
          handleStepDelete={this.handleStepDelete}
          handleCancelSubmit={this.handleCancelSubmit}
          handleIngredientDelete={this.handleIngredientDelete}
          closeAlert={this.closeAlert}
          handleImageAdd={this.handleImageAdd}
          handleIngredientSelect={this.handleIngredientSelect}
          handleIngredientChange={this.handleIngredientChange}
          handleStepSelect={this.handleStepSelect}
          handleStepChange={this.handleStepChange}
          handleImageRemove={this.handleImageRemove}
          handleRequestIngredientClose={this.handleRequestIngredientClose}
          handleRequestIngredientOpen={this.handleRequestIngredientOpen}
          handleRequestIngredientSubmit={this.handleRequestIngredientSubmit}
        />
        {this.state.submitIsLoading ? (
          <CircularProgress
            size={sizeLoadingSymbol}
            className={this.props.classes.loadingSymbolScreen}
          />
        ) : (
          ""
        )}
        {this.renderNoStepsAlert()}
        {this.renderNoIngredientsAlert()}
        {this.renderImageRejectedAlert()}
        {this.renderRequestIngredientSubmittedAlert()}
        {this.renderChangeResetsRatingAlert()}
      </div>
    );
  }
}

const styles = theme => ({
  paper: {
    margin: "auto",
    padding: theme.spacing.unit * 2
  },
  autosuggestContainer: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1000,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  dropzoneRoot: {
    display: "flex",
    justifyContent: "center",
    height: "100%"
  },
  dropzoneContainer: {
    display: "flex",
    justifyContent: "center",
    margin: 0,
    position: "relative"
  },
  clearImageButton: {
    position: "absolute",
    right: "5px",
    top: "5px"
  },
  loadingSymbol: {
    position: "absolute",
    right: "50%",
    marginRight: `-${sizeLoadingSymbol / 2}px`,
    top: "50%",
    marginTop: `-${sizeLoadingSymbol / 2}px`
  },
  loadingSymbolScreen: {
    position: "fixed",
    right: "50%",
    marginRight: `-${sizeLoadingSymbol / 2}px`,
    top: "50%",
    marginTop: `-${sizeLoadingSymbol / 2}px`
  },
  ingredientDialogContent: {
    minHeight: "250px"
  }
});

const mapStateToProps = state => ({
  myRecipe: state.myRecipe,
  user: state.user,
  referenceData: state.referenceData,
  recipe: state.recipe
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {
      addIngredientToRecipe,
      removeIngredientFromRecipe,
      addStepToRecipe,
      removeStepFromRecipe,
      addRecipe,
      getIngredientList,
      resetRecipeForm,
      changeRecipeIngredient,
      changeRecipeStep,
      saveChangesRecipe,
      submitNewIngredientRequest
    }
  )(RecipeFormContainer)
);
