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
    handleAutosuggestChange
  } = props;
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

        <Typography variant="h6">Ingredients</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleIngredientOpen}
        >
          Add new ingredient
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
                value: state.single,
                onChange: handleAutosuggestChange("single")
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
            {
              state.nosuggestions ? 
            <DialogContentText>
              Please select an existing ingredient from the list.
            </DialogContentText>
            : ""
            }
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
              value={state.amountNumber}
              onChange={handleChange}
              type="number"
              margin="normal"
              required
            />
            {state.amountType === "1" ? (
              amountTypes.find(type => type.id === 1).units.length > 0 ? (
                <FormControl>
                  <InputLabel>
                    {amountTypes.find(type => type.id === 1).name}
                  </InputLabel>
                  <Select
                    native
                    value={state[amountTypes.find(type => type.id === 1).name]}
                    onChange={handleChange}
                    inputProps={{
                      name: amountTypes.find(type => type.id === 1).name,
                      id: amountTypes.find(type => type.id === 1).name
                    }}
                  >
                    {amountTypes
                      .find(type => type.id === 1)
                      .units.map(unit => (
                        <option value={unit}>{unit}</option>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <div />
              )
            ) : state.amountType === "2" ? (
              amountTypes.find(type => type.id === 2).units.length > 0 ? (
                <FormControl>
                  <InputLabel>
                    {amountTypes.find(type => type.id === 2).name}
                  </InputLabel>
                  <Select
                    native
                    value={state[amountTypes.find(type => type.id === 2).name]}
                    onChange={handleChange}
                    inputProps={{
                      name: amountTypes.find(type => type.id === 2).name,
                      id: amountTypes.find(type => type.id === 2).name
                    }}
                  >
                    {amountTypes
                      .find(type => type.id === 2)
                      .units.map(unit => (
                        <option value={unit}>{unit}</option>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <div />
              )
            ) : state.amountType === "3" ? (
              amountTypes.find(type => type.id === 3).units.length > 0 ? (
                <FormControl>
                  <InputLabel>
                    {amountTypes.find(type => type.id === 3).name}
                  </InputLabel>
                  <Select
                    native
                    value={state[amountTypes.find(type => type.id === 3).name]}
                    onChange={handleChange}
                    inputProps={{
                      name: amountTypes.find(type => type.id === 3).name,
                      id: amountTypes.find(type => type.id === 3).name
                    }}
                  >
                    {amountTypes
                      .find(type => type.id === 3)
                      .units.map(unit => (
                        <option value={unit}>{unit}</option>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <div />
              )
            ) : 
            ""}
            <Typography>{state.single}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleIngredientClose} color="primary">
              Add ingredient
            </Button>
            <Button onClick={handleIngredientClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <List>
          {myRecipe.ingredients.map(ingredient => (
            <ListItem key={ingredient.id} disableGutters={true}>
              <ListItemText>{ingredient.name}</ListItemText>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6">Steps</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          Add new step
        </Button>
        <List>
          {myRecipe.steps.map(step => (
            <ListItem key={step.id} disableGutters={true}>
              <ListItemText>{step.description}</ListItemText>
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
      </form>
    </Paper>
  );
}
