import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
import { setRecipeUserRating } from "./ratings";

export const SET_RECIPE = "SET_RECIPE";
export const SET_OPENED_RECIPE = "SET_OPENED_RECIPE";
export const SET_MY_RECIPES = "SET_MY_RECIPES";
export const SET_RECIPE_IMAGE = "SET_RECIPE_IMAGE";
export const SET_IS_SELECTED_RECIPE = "SET_IS_SELECTED_RECIPE";
export const ADD_NEW_INGREDIENT = "ADD_NEW_INGREDIENT";
export const ADD_NEW_STEP = "ADD_NEW_STEP";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";
export const DELETE_STEP = "DELETE_STEP";
export const SET_DELETE_RECIPE_SUCCESS = "SET_DELETE_RECIPE_SUCCESS";
export const RESET_MY_RECIPE = "RESET_MY_RECIPE";
export const SET_EDIT_MODE_YES = "SET_EDIT_MODE_YES";
export const PREFILL_RECIPE_TO_EDIT = "PREFILL_RECIPE_TO_EDIT";
export const CHANGE_INGREDIENT = "CHANGE_INGREDIENT";
export const CHANGE_STEP = "CHANGE_STEP";
export const SET_PLACEHOLDER_IMAGE = "SET_PLACEHOLDER_IMAGE";
export const SET_RECIPE_HISTORY = "SET_RECIPE_HISTORY";

//Alerts
export const alertIngredientAlreadyPresent = "alertIngredientAlreadyPresent";

const setRecipe = recipe => {
  return { type: SET_RECIPE, payload: recipe };
};

const setOpenedRecipe = () => {
  return { type: SET_OPENED_RECIPE, payload: null };
};

const setMyRecipes = (recipes, count) => {
  return { type: SET_MY_RECIPES, payload: { recipes, count } };
};

const setRecipeHistory = (recipes, count) => {
  return { type: SET_RECIPE_HISTORY, payload: { recipes, count } };
};

const setRecipeImage = imageUrl => {
  return { type: SET_RECIPE_IMAGE, payload: { imageUrl } };
};

const addNewIngredient = ingredient => {
  return { type: ADD_NEW_INGREDIENT, payload: ingredient };
};

const changeIngredient = (newIngredient, arrayIndex) => {
  return { type: CHANGE_INGREDIENT, payload: { newIngredient, arrayIndex } };
};

const deleteIngredient = id => {
  return {
    type: DELETE_INGREDIENT,
    payload: id
  };
};

const addNewStep = step => {
  return { type: ADD_NEW_STEP, payload: step };
};

const changeStep = (newStep, arrayIndex) => {
  return { type: CHANGE_STEP, payload: { newStep, arrayIndex } };
};

const deleteStep = indexStepArray => {
  return { type: DELETE_STEP, payload: indexStepArray };
};

const resetMyRecipe = () => {
  return { type: RESET_MY_RECIPE, payload: null };
};

const setIsSelectedRecipe = () => {
  return { type: SET_IS_SELECTED_RECIPE, payload: null };
};

const setDeleteRecipeSuccess = () => {
  return { type: SET_DELETE_RECIPE_SUCCESS, payload: null };
};

const setEditModeYes = () => {
  return { type: SET_EDIT_MODE_YES, payload: null };
};

const prefillRecipeToEdit = recipe => {
  return { type: PREFILL_RECIPE_TO_EDIT, payload: recipe };
};

const setPlaceholerImage = () => {
  return { type: SET_PLACEHOLDER_IMAGE, payload: null };
};

export const selectRecipe = recipeId => (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  const user = userId(jwt);

  request
    .post(`${baseUrl}/users/${user}/recipes/${recipeId}/selected-recipes`)
    .then(_ => dispatch(setIsSelectedRecipe()))
    .catch(err => console.error(err));
};

export const openSelectedRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  const user = userId(jwt);

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/recipes/${recipeId}`)
    .then(result => {
      dispatch(setRecipe(result.body));
    })
    .then(() => dispatch(setIsSelectedRecipe()))
    .catch(err => console.error(err));

  request
    .get(`${baseUrl}/recipes/${recipeId}/images/random`)
    .then(result => dispatch(setRecipeImage(result.body.imageUrl)))
    .catch(err => console.error(err));

  request
    .get(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .then(result =>
      dispatch(
        setRecipeUserRating({
          recipeIsLiked: result.body.recipeIsLiked,
          newRating: result.body.newRating
        })
      )
    )
    .catch(err => console.error(err));
};

export const openRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/recipes/${recipeId}`)
    .then(result => {
      dispatch(setRecipe(result.body));
    })
    .then(() => dispatch(setOpenedRecipe()))
    .catch(err => console.error(err));

  request
    .get(`${baseUrl}/recipes/${recipeId}/images/random`)
    .then(result => dispatch(setRecipeImage(result.body.imageUrl)))
    .catch(err => console.error(err));
};

export const addRecipe = (recipe, user, imageFile) => async () => {

  let recipeId;

  await request
    .post(`${baseUrl}/recipes`)
    .send({ ...recipe, userId: user })
    .then(result => (recipeId = result.body.id))
    .catch(err => console.error(err));

  if (recipe.recipeIngredients)
    await recipe.recipeIngredients.map(ingredient =>
      request
        .post(
          `${baseUrl}/recipes/${recipeId}/ingredients/${
            ingredient.ingredientId
          }`
        )
        .send({
          amount: ingredient.amount
        })
        .catch(err => console.error(err))
    );

  if (recipe.steps)
    await recipe.steps.map((step, index) =>
      request
        .post(`${baseUrl}/recipes/${recipeId}/steps`)
        .send({
          order: index,
          description: step.description
        })
        .catch(err => console.error(err))
    );

    await request
      .post(`${baseUrl}/recipes/${recipeId}/images`)
      .attach("file", imageFile)
      .catch(err => console.error(err));

  return undefined;
};

export const saveChangesRecipe = recipe => async dispatch => {
  await request
    .put(`${baseUrl}/recipes/${recipe.id}`)
    .send(recipe)
    .catch(err => console.error(err));

  return undefined;
};

export const addIngredientToRecipe = ingredient => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  if (
    state.myRecipe.ingredients.find(
      existingIngredient =>
        existingIngredient.ingredientId === ingredient.ingredientId
    )
  ) {
    return alertIngredientAlreadyPresent;
  }
  return dispatch(addNewIngredient(ingredient));
};

export const changeRecipeIngredient = (newIngredient, arrayIndex) => (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  if (
    state.myRecipe.ingredients.filter(
      (existingIngredient, index) =>
        existingIngredient.ingredientId === newIngredient.ingredientId &&
        index !== arrayIndex
    ).length === 1
  ) {
    return alertIngredientAlreadyPresent;
  }
  return dispatch(changeIngredient(newIngredient, arrayIndex));
};

export const removeIngredientFromRecipe = id => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(deleteIngredient(id));
};

export const addStepToRecipe = step => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(addNewStep(step));
};

export const changeRecipeStep = (newStep, arrayIndex) => (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(changeStep(newStep, arrayIndex));
};

export const removeStepFromRecipe = indexStepArray => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(deleteStep(indexStepArray));
};

export const getRandomRecipe = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());
  const user = userId(jwt);
  let recipeId;

  //Build query based on filters
  const filterIds = Object.keys(state.filters);
  const queryFilters = filterIds.reduce((acc, filter) => {
    if (state.filters[filter]) acc[filter] = state.filters[filter];
    return acc;
  }, {});

  await request
    .get(`${baseUrl}/random-recipe`)
    .query(queryFilters)
    .then(result => {
      recipeId = result.body.id;
      dispatch(setRecipe(result.body));
    })
    .catch(err => console.error(err));

  request
    .get(`${baseUrl}/recipes/${recipeId}/images/random`)
    .then(result => dispatch(setRecipeImage(result.body.imageUrl)))
    .catch(err => console.error(err));

  request
    .get(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .then(result =>
      dispatch(
        setRecipeUserRating({
          recipeIsLiked: result.body.recipeIsLiked,
          newRating: result.body.newRating
        })
      )
    )
    .catch(err => console.error(err));
};

export const getMyRecipes = (limit, offset) => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  request
    .get(`${baseUrl}/users/${user}/recipes`)
    .query({ limit, offset })
    .then(result => {
      const recipes = result.body[0];
      const count = result.body[1];
      dispatch(setMyRecipes(recipes, count));
    })
    .catch(err => console.error(err));
};

export const getMyRecipeHistory = (limit, offset) => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  request
    .get(`${baseUrl}/users/${user}/selected-recipes`)
    .query({ limit, offset })
    .then(result => {
      const recipes = result.body[0];
      const count = result.body[1];
      dispatch(setRecipeHistory(recipes, count));
    })
    .catch(err => console.error(err));
};

export const deleteRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .delete(`${baseUrl}/recipes/${recipeId}`)
    .then(result => {
      if (result.statusCode === 204) dispatch(setDeleteRecipeSuccess());
    })
    .catch(err => console.error(err));
};

export const resetRecipeForm = () => dispatch => {
  return dispatch(resetMyRecipe());
};

export const openEditRecipeForm = () => (dispatch, getState) => {
  const state = getState();

  dispatch(setEditModeYes());
  return dispatch(prefillRecipeToEdit(state.recipe));
};

export const resetPlaceholderImage = () => dispatch => {
  return dispatch(setPlaceholerImage());
};
