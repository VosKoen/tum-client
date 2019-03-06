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
import { sizeLoadingSymbol } from "../../constants";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ClearIcon from "@material-ui/icons/Clear";

import { Grid, CardMedia } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { alertIngredientAlreadyPresent } from "../../actions/recipes";

import Dropzone from "react-dropzone";
import classNames from "classnames";

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
    handleImageAdd,
    handleIngredientSelect,
    handleIngredientChange,
    handleStepSelect,
    handleStepChange,
    handleImageRemove,
    handleRequestIngredientClose,
    handleRequestIngredientOpen,
    handleRequestIngredientSubmit
  } = props;

  return (
    <Paper className={classes.paper}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <Grid container direction="column">
              <Grid item>
                <Dropzone onDrop={handleImageAdd} accept="image/*">
                  {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                      <div className={classes.dropzoneRoot}>
                        <div className={classes.dropzoneContainer}>
                          <div
                            {...getRootProps()}
                            className={classNames("dropzone", {
                              "dropzone--isActive": isDragActive
                            })}
                          >
                            <input {...getInputProps()} />

                            <CardMedia
                              component="img"
                              src={myRecipe.imageUrl}
                              title="finished-dish"
                            />
                          </div>
                          <IconButton
                            aria-label="Remove image"
                            onClick={handleImageRemove}
                            className={classes.clearImageButton}
                          >
                            <ClearIcon />
                          </IconButton>
                          {state.imageIsLoading ? (
                            <CircularProgress
                              className={classes.loadingSymbol}
                              size={sizeLoadingSymbol}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    );
                  }}
                </Dropzone>
              </Grid>
              <Grid item>
                <Typography>
                  Drop your image file above or click on the image area above to
                  select a file for upload
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="recipe-title"
              name="recipeTitle"
              label="Recipe title"
              value={state.recipeTitle}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              fullWidth
            />

            <TextField
              id="recipe-description"
              name="recipeDescription"
              label="Description"
              multiline
              rows="11"
              value={state.recipeDescription}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <Grid container justify={"flex-start"} spacing={16}>
              <Grid item>
                <Typography variant="h6" align="left">
                  Ingredients
                </Typography>
              </Grid>
              <Grid item>
                <Grid container justify="flex-start">
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleIngredientOpen}
                  >
                    Add new ingredient
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <List>
              {myRecipe.ingredients.map((ingredient, index) => (
                <ListItem
                  key={ingredient.ingredientId}
                  disableGutters={true}
                  onClick={() => handleIngredientSelect(index)}
                  divider
                  button
                >
                  <ListItemText>
                    {ingredient.amount} {ingredient.name}
                  </ListItemText>
                  <ListItemSecondaryAction
                    onClick={() =>
                      handleIngredientDelete(ingredient.ingredientId)
                    }
                  >
                    <IconButton aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container justify={"flex-start"} spacing={16}>
              <Grid item>
                <Typography variant="h6" align="left">
                  Steps
                </Typography>
              </Grid>
              <Grid item>
                <Grid container justify="flex-start">
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleStepOpen}
                  >
                    Add new step
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <List>
              {myRecipe.steps.map((step, index) => (
                <ListItem
                  key={index}
                  disableGutters={true}
                  onClick={() => handleStepSelect(index)}
                  divider
                  button
                >
                  <ListItemText>{step.description}</ListItemText>
                  <ListItemSecondaryAction
                    onClick={() => handleStepDelete(index)}
                  >
                    <IconButton aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Grid container justify="flex-start" spacing={16}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              {myRecipe.editMode ? "Save changes" : "Submit recipe"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleCancelSubmit}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>

        <Dialog
          open={state.ingredientOpen}
          onClose={handleIngredientClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>{"Add new ingredient"}</DialogTitle>
          <DialogContent>
            <div className={classes.ingredientDialogContent}>
              <Autosuggest
                {...autosuggestProps}
                inputProps={{
                  classes,
                  placeholder: "Search for an ingredient",
                  value: state.ingredient,
                  onChange: handleAutosuggestChange("ingredient")
                }}
                theme={{
                  container: classes.autosuggestContainer,
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

              <TextField
                id="amount"
                name="amount"
                label="Amount"
                value={state.amount}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                placeholder='eg. "50 grams"'
              />
              <DialogContentText>
                Cannot find the ingredient you are looking for? Request an
                ingredient to be added to the list.
              </DialogContentText>
              <Button
                variant="text"
                color="primary"
                onClick={() => handleRequestIngredientOpen()}
              >
                Request ingredient
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            {state.isIngredientEditMode ? (
              <Button onClick={handleIngredientChange} color="primary">
                Change ingredient
              </Button>
            ) : (
              <Button
                onClick={handleIngredientAdd}
                color="primary"
                disabled={!state.ingredientSelected}
              >
                Add ingredient
              </Button>
            )}

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
              name="stepDescription"
              value={state.stepDescription}
              onChange={handleChange}
              multiline
              rowsMax="5"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            {state.isStepEditMode ? (
              <Button
                onClick={handleStepChange}
                color="primary"
                disabled={!state.stepDescription}
              >
                Change step
              </Button>
            ) : (
              <Button
                onClick={handleStepAdd}
                color="primary"
                disabled={!state.stepDescription}
              >
                Add step
              </Button>
            )}

            <Button onClick={handleStepClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={state.alertIngredientAlreadyPresent}
          onClose={() => closeAlert(alertIngredientAlreadyPresent)}
        >
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

        <Dialog
          open={state.requestIngredientOpen}
          onClose={() => handleRequestIngredientClose()}
        >
          <DialogContent>
            <DialogContentText>
              Please type in the ingredient which is missing from the database
              and submit.
            </DialogContentText>
            <TextField
              id="newIngredient"
              name="newIngredient"
              label="Ingredient"
              value={state.newIngredient}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleRequestIngredientSubmit(state.newIngredient)}
              color="primary"
            >
              Submit request
            </Button>
            <Button
              onClick={() => handleRequestIngredientClose()}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Paper>
  );
}
