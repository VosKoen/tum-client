import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autosuggest from "react-autosuggest";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { amountTypes } from "../../constants";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import {alertIngredientAlreadyPresent} from '../../actions/recipes'

import Dropzone from "react-dropzone";
import classNames from 'classnames'

function renderIngredientAmountType(state, handleChange) {
  const amountType = parseInt(state.amountType);
  const selectedAmountType = amountTypes.find(type => type.id === amountType);

  if (state.amountType !== undefined && selectedAmountType.units.length > 0)
    return (
      <FormControl>
        <InputLabel>{selectedAmountType.name}</InputLabel>
        <Select
          native
          value={state.unit}
          onChange={handleChange}
          inputProps={{
            name: "unit",
            id: "unit"
          }}
        >
          {selectedAmountType.units.map(unit => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </Select>
      </FormControl>
    );

  return <div />;
}

export default function RecipeForm(props) {
  const {
    classes,
    handleSubmit,
    handleChange,
    state,
    myRecipe,
    handleIngredientOpen,
    handleIngredientClose,
    autosuggestProps,
    handleAutosuggestChange,
    handleIngredientAdd,
    handleStepOpen,
    handleStepClose,
    handleStepAdd,
    handleStepDelete,
    handleCancelSubmit,
    handleIngredientDelete,
    closeAlert,
    handleImageAdd
  } = props;

  const ingredientAmountType = renderIngredientAmountType(state, handleChange);

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <TextField
          id="recipe-title"
          name="recipeTitle"
          label="Recipe title"
          className={classes.textField}
          value={state.recipeTitle}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          id="recipe-description"
          name="recipeDescription"
          label="Description"
          multiline
          rowsMax="8"
          value={state.recipeDescription}
          onChange={handleChange}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          required
        />

        <Dropzone onDrop={handleImageAdd}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={classNames("dropzone", {
                  "dropzone--isActive": isDragActive
                })}
              >
                <input {...getInputProps()} />
                <img src={myRecipe.image} alt='finished-dish'/>
                {isDragActive ? (
                  <p>Drop files here...</p>
                ) : (
                  <p>
                    Try dropping some files here, or click to select files to
                    upload.
                  </p>
                )}
              </div>
            );
          }}
        </Dropzone>

        <Typography variant="h6">Ingredients</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleIngredientOpen}
        >
          Add new ingredient
        </Button>

        <List>
          {myRecipe.ingredients.map(ingredient => (
            <ListItem
              key={ingredient.id}
              disableGutters={true}
              onClick={() => console.log("Clicked item!")}
              divider
            >
              <ListItemText>{ingredient.amountNumber}</ListItemText>
              <ListItemText>{ingredient.unit}</ListItemText>
              <ListItemText>{ingredient.name}</ListItemText>
              <ListItemSecondaryAction
                onClick={() => handleIngredientDelete(ingredient.id)}
              >
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {/* 
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          component="label"
        >
          Upload image
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Button> */}

        <Typography variant="h6">Steps</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleStepOpen}
        >
          Add new step
        </Button>
        <List>
          {myRecipe.steps.map((step, index) => (
            <ListItem key={index} disableGutters={true} divider>
              <ListItemText>{step.description}</ListItemText>
              <ListItemSecondaryAction onClick={() => handleStepDelete(index)}>
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Submit recipe
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleCancelSubmit}
        >
          Cancel
        </Button>

        <Dialog
          fullScreen
          open={state.ingredientOpen}
          onClose={handleIngredientClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>{"Add new ingredient"}</DialogTitle>
          <DialogContent>
            <Autosuggest
              {...autosuggestProps}
              inputProps={{
                classes,
                placeholder: "Search for an ingredient",
                value: state.ingredient,
                onChange: handleAutosuggestChange("ingredient")
              }}
              theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion
              }}
              renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} square>
                  {options.children}
                </Paper>
              )}
            />
            {state.nosuggestions ? (
              <DialogContentText>
                Please select an existing ingredient from the list.
              </DialogContentText>
            ) : (
              ""
            )}
            {state.ingredientSelected ? (
              <div>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="amount-type"
                    name="amountType"
                    value={state.amountType}
                    onChange={handleChange}
                  >
                    {amountTypes.map((amountType, index) => (
                      <FormControlLabel
                        key={index}
                        value={amountType.id.toString()}
                        control={<Radio />}
                        label={amountType.name}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <TextField
                  id="amount-number"
                  name="amountNumber"
                  value={state.amountNumber}
                  onChange={handleChange}
                  type="number"
                  margin="normal"
                  required
                />

                {ingredientAmountType}
                <Typography>{state.ingredient}</Typography>
              </div>
            ) : (
              <div />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleIngredientAdd} color="primary">
              Add ingredient
            </Button>
            <Button onClick={handleIngredientClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={state.stepOpen}
          onClose={handleStepClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>{"Add new step"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please describe this cooking step.
            </DialogContentText>
            <TextField
              autoFocus
              id="step"
              label="Cooking step"
              name="stepDescription"
              value={state.stepDescription}
              onChange={handleChange}
              multiline
              rowsMax="5"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleStepAdd} color="primary">
              Add step
            </Button>
            <Button onClick={handleStepClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={state.alertIngredientAlreadyPresent} onClose={() => closeAlert(alertIngredientAlreadyPresent)}>
          <DialogContent>
            <DialogContentText>
              The selected ingredient is already present in the recipe. If you
              want to change the details of this ingredient please click on the
              ingredient in the recipe overview.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => closeAlert(alertIngredientAlreadyPresent)}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Paper>
  );
}
