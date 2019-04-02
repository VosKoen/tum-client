import * as request from "superagent";
import { baseUrl, imagePlaceholder } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
import { setRecipeUserRating } from "./ratings";
import { handleError } from "./error";

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
export const SET_RECIPE_HISTORY = "SET_RECIPE_HISTORY";
export const SET_RECIPE_IMAGE_IS_USER = "SET_RECIPE_IMAGE_IS_USER";

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

const setRecipeImage = (imageUrl, imageId) => {
  return { type: SET_RECIPE_IMAGE, payload: { imageUrl, imageId } };
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

const setRecipeImageIsUser = boolean => {
  return { type: SET_RECIPE_IMAGE_IS_USER, payload: boolean };
};

export const selectRecipe = recipeId => (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  const user = userId(jwt);

  request
    .post(`${baseUrl}/users/${user}/recipes/${recipeId}/selected-recipes`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(_ => dispatch(setIsSelectedRecipe()))
    .catch(err => handleError(dispatch, err));
};

export const openSelectedRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  const user = userId(jwt);

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/recipes/${recipeId}`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      dispatch(setRecipe(result.body));
    })
    .then(() => dispatch(setIsSelectedRecipe()))
    .catch(err => handleError(dispatch, err));

  getRecipeUserImage(recipeId, user, dispatch, jwt);

  request
    .get(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result =>
      dispatch(
        setRecipeUserRating({
          recipeIsLiked: result.body.recipeIsLiked,
          newRating: result.body.newRating
        })
      )
    )
    .catch(err => handleError(dispatch, err));
};

export const openRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();

  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/recipes/${recipeId}`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      dispatch(setRecipe(result.body));
    })
    .then(() => dispatch(setOpenedRecipe()))
    .catch(err => handleError(dispatch, err));

  getRandomImage(recipeId, dispatch, jwt);
};

export const addRecipe = (recipe, imageFile, jwt) => async dispatch => {
  let recipeId;

  await request
    .post(`${baseUrl}/recipes`)
    .set("Authorization", `Bearer ${jwt}`)
    .send({ ...recipe })
    .then(result => (recipeId = result.body.id))
    .catch(err => handleError(dispatch, err));

  if (recipe.recipeIngredients)
    await recipe.recipeIngredients.map(ingredient =>
      request
        .post(
          `${baseUrl}/recipes/${recipeId}/ingredients/${
            ingredient.ingredientId
          }`
        )
        .set("Authorization", `Bearer ${jwt}`)
        .send({
          amount: ingredient.amount
        })
        .catch(err => handleError(dispatch, err))
    );

  if (recipe.steps)
    await recipe.steps.map((step, index) =>
      request
        .post(`${baseUrl}/recipes/${recipeId}/steps`)
        .set("Authorization", `Bearer ${jwt}`)
        .send({
          order: index,
          description: step.description
        })
        .catch(err => handleError(dispatch, err))
    );

  if (imageFile)
    await request
      .post(`${baseUrl}/recipes/${recipeId}/own-image`)
      .set("Authorization", `Bearer `)
      .attach("file", imageFile)
      .catch(err => handleError(dispatch, err));

  return undefined;
};

export const saveChangesRecipe = (
  recipe,
  imageFile,
  removeOwnImage,
  jwt
) => async dispatch => {
  await request
    .put(`${baseUrl}/recipes/${recipe.id}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send(recipe)
    .catch(err => handleError(dispatch, err));

  //Replacing the recipes own image if a new image file is present
  if (imageFile)
    await request
      .put(`${baseUrl}/recipes/${recipe.id}/own-image`)
      .set("Authorization", `Bearer ${jwt}`)
      .attach("file", imageFile)
      .catch(err => handleError(dispatch, err));

  //Removing the recipes own image if it is actively removed without providing a new image
  if (removeOwnImage && !imageFile)
    await request
      .delete(`${baseUrl}/recipes/${recipe.id}/own-image`)
      .set("Authorization", `Bearer ${jwt}`)
      .catch(err => handleError(dispatch, err));

  return undefined;
};

export const addIngredientToRecipe = ingredient => (dispatch, getState) => {
  const state = getState();

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

export const removeIngredientFromRecipe = id => dispatch => {
  return dispatch(deleteIngredient(id));
};

export const addStepToRecipe = step => dispatch => {
  return dispatch(addNewStep(step));
};

export const changeRecipeStep = (newStep, arrayIndex) => dispatch => {
  return dispatch(changeStep(newStep, arrayIndex));
};

export const removeStepFromRecipe = indexStepArray => dispatch => {
  return dispatch(deleteStep(indexStepArray));
};

const getRandomImage = (recipeId, dispatch, jwt) => {
  dispatch(setRecipeImageIsUser(false));

  request
    .get(`${baseUrl}/recipes/${recipeId}/images/random`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result =>
      dispatch(setRecipeImage(result.body.imageUrl, result.body.id))
    )
    .catch(err => {
      if (err.status === 404) {
        dispatch(setRecipeImage(imagePlaceholder, null));
      } else {
        handleError(dispatch, err);
      }
    });
};

const getRecipeUserImage = (recipeId, userId, dispatch, jwt) => {
  request
    .get(`${baseUrl}/recipes/${recipeId}/users/${userId}/images`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      dispatch(setRecipeImageIsUser(true));
      dispatch(setRecipeImage(result.body.imageUrl, result.body.id));
    })
    .catch(err => {
      if (err.status === 404) {
        getRandomImage(recipeId, dispatch, jwt);
      } else {
        handleError(dispatch, err);
      }
    });
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
    .set("Authorization", `Bearer ${jwt}`)
    .query(queryFilters)
    .then(result => {
      recipeId = result.body.id;
      dispatch(setRecipe(result.body));
    })
    .catch(err => handleError(dispatch, err));

  getRandomImage(recipeId, dispatch, jwt);

  request
    .get(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result =>
      dispatch(
        setRecipeUserRating({
          recipeIsLiked: result.body.recipeIsLiked,
          newRating: result.body.newRating
        })
      )
    )
    .catch(err => handleError(dispatch, err));
};

export const getMyRecipes = (limit, offset) => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  request
    .get(`${baseUrl}/users/${user}/recipes`)
    .set("Authorization", `Bearer ${jwt}`)
    .query({ limit, offset })
    .then(result => {
      const recipes = result.body[0];
      const count = result.body[1];
      dispatch(setMyRecipes(recipes, count));
    })
    .catch(err => handleError(dispatch, err));
};

export const getMyRecipeHistory = (limit, offset) => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  request
    .get(`${baseUrl}/users/${user}/selected-recipes`)
    .set("Authorization", `Bearer ${jwt}`)
    .query({ limit, offset })
    .then(result => {
      const recipes = result.body[0];
      const count = result.body[1];
      dispatch(setRecipeHistory(recipes, count));
    })
    .catch(err => handleError(dispatch, err));
};

export const deleteRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .delete(`${baseUrl}/recipes/${recipeId}`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      if (result.statusCode === 204) dispatch(setDeleteRecipeSuccess());
    })
    .catch(err => handleError(dispatch, err));
};

export const resetRecipeForm = () => dispatch => {
  return dispatch(resetMyRecipe());
};

export const openEditRecipeForm = () => (dispatch, getState) => {
  const state = getState();

  dispatch(setEditModeYes());
  return dispatch(prefillRecipeToEdit(state.recipe));
};

export const addPhotoToRecipe = (recipeId, imageFile) => async (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  await request
    .post(`${baseUrl}/recipes/${recipeId}/users/${user}/images`)
    .set("Authorization", `Bearer ${jwt}`)
    .attach("file", imageFile)
    .then(res => {
      dispatch(setRecipeImage(res.body.imageUrl, res.body.id));
      dispatch(setRecipeImageIsUser(true));
    })
    .catch(err => handleError(dispatch, err));

  return undefined;
};

export const clearPhotoFromRecipe = recipeId => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  await request
    .delete(`${baseUrl}/recipes/${recipeId}/users/${user}/images`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(_ => {
      getRandomImage(recipeId, dispatch, jwt);
    })
    .catch(err => handleError(dispatch, err));
};
