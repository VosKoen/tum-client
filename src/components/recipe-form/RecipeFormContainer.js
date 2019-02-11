import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import RecipeForm from "./RecipeForm";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { ingredientNames } from "../../constants";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  addIngredientToRecipe,
  removeIngredientFromRecipe,
  addStepToRecipe,
  removeStepFromRecipe,
  addRecipe,
  uploadImage
} from "../../actions/recipes";
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

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : ingredientNames.filter(suggestion => {
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
    imageFiles: [],
    imageResized: false
  };

  handleIngredientSelected = value => {
    let ingredientSelected = false;
    const suggestions = getSuggestions(value);

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
    const suggestions = getSuggestions(value);

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
      unit: ""
    });
  };

  handleIngredientClose = () => {
    this.setState({ ingredientOpen: false, ingredient: "" });
  };

  handleIngredientAdd = () => {
    const ingredient = {
      ingredientId: ingredientNames.find(
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

  handleIngredientDelete = ingredientId => {
    this.props.removeIngredientFromRecipe(ingredientId);
  };

  handleStepOpen = () => {
    this.setState({ stepOpen: true, stepDescription: "" });
  };

  handleStepClose = () => {
    this.setState({ stepOpen: false });
  };

  handleStepAdd = () => {
    const step = {
      description: this.state.stepDescription
    };

    this.props.addStepToRecipe(step);
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
      image: this.props.myRecipe.image
    };

    this.props.addRecipe(recipe);

    e.preventDefault();
  };

  handleCancelSubmit = () => {
    this.setState({ cancelSubmit: true });
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

  // handleImageUpload = async e => {
  //   const image = e.target.files[0];
  //   this.setState({ uploadingImage: true });
  //   await this.props.uploadImage(image)
  //   this.setState({ uploadingImage: false });
  // };

  handleImageAdd = files => {
    this.resizeImage(files[0].file);

    this.setState({
      imageFiles: files.map(fileItem => {
        return fileItem.file;
      }),
      imageResized: false
    });

    //Resize image

    //Upload the files in the background
    // files.map(fileItem => this.props.uploadImage(fileItem.file));
  };

  storeResizedImage = resizedImage => {
    this.setState({
      resizedImage,
      imageResized: true
    });

    this.props.uploadImage(resizedImage)
  };

  resizeImage = image => {
    const maxWidth = 350;
    const fileName = image.name;
    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = async event => {
      const img = new Image();
      img.src = event.target.result;

      if (img.width <= maxWidth) return;
      const width = maxWidth;
      const height = img.height*(width/img.width);

      img.onload = () => {
        const elem = document.createElement("canvas");
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");
        // img.width and img.height will give the original dimensions
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          blob => {
            const resizedImage = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            this.storeResizedImage(resizedImage);
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
  user: state.user
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
      uploadImage
    }
  )(RecipeFormContainer)
);
