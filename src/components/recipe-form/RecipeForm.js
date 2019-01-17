import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export default function RecipeForm(props) {
  const { classes, handleSubmit, handleChange, state } = props;
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
