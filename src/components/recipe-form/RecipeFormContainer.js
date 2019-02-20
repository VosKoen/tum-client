import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import RecipeForm from "./RecipeForm";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { maxWidth } from "../../constants";
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
  saveChangesRecipe
} from "../../actions/recipes";
import { getIngredientList } from "../../actions/ingredients";
import { Redirect } from "react-router-dom";

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
    alertIngredientAlreadyPresent: false,
    imageFiles: []
  };

  componentDidMount = () => {
    this.props.getIngredientList();

    if (this.props.myRecipe.editMode)
      this.setState({
        recipeTitle: this.props.recipe.title,
        recipeDescription: this.props.recipe.description
      });
  };

  handleIngredientSelected = value => {
    let ingredientSelected = false;
    const suggestions = getSuggestions(value, this.props.ingredients);

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
    const suggestions = getSuggestions(value, this.props.ingredients);

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
    const ingredient = {
      ingredientId: this.props.ingredients.find(
        ingredient => ingredient.name === this.state.ingredient
      ).id,
      amountType: this.state.amountType,
      amountNumber: this.state.amountNumber,
      unit: this.state.unit,
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
      ingredientId: this.props.ingredients.find(
        ingredient => ingredient.name === this.state.ingredient
      ).id,
      amountType: this.state.amountType,
      amountNumber: this.state.amountNumber,
      unit: this.state.unit,
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
    this.setState({ submitRecipe: true });

    const recipe = {
      title: this.state.recipeTitle,
      description: this.state.recipeDescription,
      recipeIngredients: this.props.myRecipe.ingredients,
      steps: this.props.myRecipe.steps,
      image: this.props.myRecipe.image,
      id: this.props.myRecipe.id
    };

    if (this.props.myRecipe.editMode) {
      this.props.saveChangesRecipe(recipe)
    } else {
      this.props.addRecipe(recipe);
    }
    this.props.resetRecipeForm();

    e.preventDefault();
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

  // handleImageAdd = files => {
  //   if (files[0]) this.resizeImage(files[0].file);
  // };

  handleImageAdd = (acceptedFiles, rejectedFiles) => {
    this.resizeImage(acceptedFiles[0]);
  };

  storeImage = image => {
    this.setState({
      imageFiles: [image]
    });
    this.props.uploadImage(image);
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
        if (img.width <= maxWidth) {
          width = img.width;
          height = img.height;
        } else {
          width = maxWidth;
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
      />
    );
  }
}

const styles = theme => ({
  container: {
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
  }
});

const mapStateToProps = state => ({
  myRecipe: state.myRecipe,
  user: state.user,
  ingredients: state.ingredients,
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
      saveChangesRecipe
    }
  )(RecipeFormContainer)
);
