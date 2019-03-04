import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import RecipeForm from "./RecipeForm";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { maxImageWidth, units , sizeLoadingSymbol} from "../../constants";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  addIngredientToRecipe,
  removeIngredientFromRecipe,
  addStepToRecipe,
  removeStepFromRecipe,
  addRecipe,
  uploadImage,
  resetRecipeForm,
  changeRecipeIngredient,
  changeRecipeStep,
  saveChangesRecipe,
  resetPlaceholderImage
} from "../../actions/recipes";
import { getIngredientList, getIngredientAmountTypeUnitList } from "../../actions/ingredients";
import { Redirect } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import {userId} from '../../jwt'

//Alert definitions
import { alertIngredientAlreadyPresent } from "../../actions/recipes";
const alertNoSteps = "alertNoSteps";
const alertNoIngredients = "alertNoIngredients";

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
          count < 5 &&
          suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

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
    amountNumber: "",
    unit: "",
    stepOpen: false,
    cancelSubmit: false,
    submitRecipe: false,
    recipeTitle: "",
    recipeDescription: "",
    [alertIngredientAlreadyPresent]: false,
    [alertNoSteps]: false,
    [alertNoIngredients]: false,
    imageFiles: [],
    imageIsLoading: false
  };

  componentDidMount = () => {
    this.props.getIngredientList();
    this.props.getIngredientAmountTypeUnitList()

    if (this.props.myRecipe.editMode)
      this.setState({
        recipeTitle: this.props.recipe.title,
        recipeDescription: this.props.recipe.description
      });
  };

  handleIngredientSelected = value => {
    let ingredientSelected = false;
    const suggestions = getSuggestions(value, this.props.referenceData.ingredients);

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
    const suggestions = getSuggestions(value, this.props.referenceData.ingredients);

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
      amountNumber: "",
      unit: "",
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
      amountNumber: selectedIngredient.amountNumber,
      amountType: selectedIngredient.amountType.toString(),
      unit: "",
      isIngredientEditMode: true,
      arrayIndexSelectedIngredient: arrayIndex
    });
  };

  handleIngredientAdd = () => {

    const unitId = (this.state.unit && units.find(unit => unit.shorthand === this.state.unit).id) || null

    const ingredient = {
      ingredientId: this.props.referenceData.ingredients.find(
        ingredient => ingredient.name === this.state.ingredient
      ).id,
      amountType: parseInt(this.state.amountType),
      amountNumber: this.state.amountNumber,
      amountTypeUnit: unitId,
      amountTypeUnitShorthand: unitId && this.props.referenceData.ingredientAmountTypeUnits.find(unit => unit.id === unitId).shorthand,
      amountTypeUnitName: unitId && this.props.referenceData.ingredientAmountTypeUnits.find(unit => unit.id === unitId).name,
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
      amountType: parseInt(this.state.amountType),
      amountNumber: this.state.amountNumber,
      amountTypeUnit: units.find(unit => unit.shorthand === this.state.unit).id,
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

  handleSubmit = async e => {
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

    const recipe = {
      title: this.state.recipeTitle,
      description: this.state.recipeDescription,
      recipeIngredients: this.props.myRecipe.ingredients,
      steps: this.props.myRecipe.steps,
      recipeImages: [{ imageUrl: this.props.myRecipe.imageUrl }],
      id: this.props.myRecipe.id
    };

    const user = userId(this.props.user.jwt);

    if (this.props.myRecipe.editMode) {
      await this.props.saveChangesRecipe(recipe, user);
    } else {
      await this.props.addRecipe(recipe, user);
    }

    this.setState({ submitRecipe: true });

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
    this.setState({
      imageIsLoading: true
    })
    this.resizeImage(acceptedFiles[0]);
  };

  storeImage = async image => {
    this.setState({
      imageFiles: [image]
    });
    await this.props.uploadImage(image);

    this.setState({
      imageIsLoading: false
    })
  };

  resizeImage = async image => {
    const fileName = image.name;
    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = async event => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width;
        let height;
        if (img.width <= maxImageWidth) {
          width = img.width;
          height = img.height;
        } else {
          width = maxImageWidth;
          height = img.height * (width / img.width);
        }

        const elem = document.createElement("canvas");
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          blob => {
            const resizedImage = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            this.storeImage(resizedImage);
          },
          "image/jpeg",
          1
        );
      };
    };
  };

  handleImageRemove = () => {
    this.props.resetPlaceholderImage();
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

        />
        {this.renderNoStepsAlert()}
        {this.renderNoIngredientsAlert()}
      </div>
    );
  }
}

const styles = theme => ({
  paper: {
    maxWidth: "95%",
    margin: "auto",
    padding: theme.spacing.unit * 2
  },
  autosuggestContainer: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
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
    position: "relative",
  },
  clearImageButton: {
    position: "absolute",
    right: "5px",
    top: "5px"
  },
  loadingSymbol: {
    position: "absolute",
    right: "50%",
    marginRight: `-${sizeLoadingSymbol/2}px`,
    top: "50%",
    marginTop: `-${sizeLoadingSymbol/2}px`
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
      uploadImage,
      getIngredientList,
      resetRecipeForm,
      changeRecipeIngredient,
      changeRecipeStep,
      saveChangesRecipe,
      resetPlaceholderImage,
      getIngredientAmountTypeUnitList
    }
  )(RecipeFormContainer)
);
