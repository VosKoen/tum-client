import * as request from "superagent";
import { baseUrl, imagePlaceholder } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
export const SET_RANDOM_RECIPE = "SET_RANDOM_RECIPE";
export const SET_MY_RECIPES = "SET_MY_RECIPES";
export const SET_RECIPE_IMAGE = "SET_RECIPE_IMAGE";
export const ADD_NEW_INGREDIENT = "ADD_NEW_INGREDIENT";
export const ADD_NEW_STEP = "ADD_NEW_STEP";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";
export const ADD_NEW_RECIPE_TO_MY_RECIPES = "ADD_NEW_RECIPE_TO_MY_RECIPES";
export const ADD_IMAGE_TO_RECIPE = "ADD_IMAGE_TO_RECIPE";

const setRandomRecipe = recipe => {
  return { type: SET_RANDOM_RECIPE, payload: recipe };
};

const setMyRecipes = recipes => {
  return { type: SET_MY_RECIPES, payload: recipes };
};

const setRecipeImage = imageUrl => {
  return { type: SET_RECIPE_IMAGE, payload: { imageUrl } };
};

const addNewIngredient = ingredient => {
  return { type: ADD_NEW_INGREDIENT, payload: ingredient };
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

const addNewRecipeToMyRecipes = recipe => {
  return { type: ADD_NEW_RECIPE_TO_MY_RECIPES, payload: recipe };
};

const addImageToRecipe = image => {
  return { type: ADD_IMAGE_TO_RECIPE, payload: image };
};

export const uploadImage = image => {
  
}

export const addRecipe = recipe => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  const user = userId(jwt);

  await request
    .post(`${baseUrl}/recipes`)
    .send({ ...recipe, userId: user })
    .then(result => (recipe = result.body))
    .catch(err => console.error(err));

  if (recipe.ingredients)
    await recipe.ingredients.map(ingredient =>
      request
        .post(
          `${baseUrl}/recipes/${recipe.id}/ingredients/${
            ingredient.ingredientId
          }`
        )
        .send({
          amount: ingredient.amountNumber,
          amountType: ingredient.amountType
        })
        .catch(err => console.error(err))
    );

  if (recipe.steps)
    await recipe.steps.map((step, index) =>
      request
        .post(`${baseUrl}/recipes/${recipe.id}/steps`)
        .send({
          order: index,
          description: step.description
        })
        .catch(err => console.error(err))
    );

  return dispatch(addNewRecipeToMyRecipes(recipe));
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
    return "alertIngredientAlreadyPresent";
  }
  return dispatch(addNewIngredient(ingredient));
};

export const removeIngredientFromRecipe = ingredientId => (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(deleteIngredient(ingredientId));
};

export const addStepToRecipe = step => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  return dispatch(addNewStep(step));
};

export const getRandomRecipe = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  let recipeId;

  await request
    .get(`${baseUrl}/recipes/random`)
    .then(result => {
      recipeId = result.body.id;
      dispatch(setRandomRecipe(result.body));
    })
    .catch(err => console.error(err));

  await request
    .get(`${baseUrl}/recipes/${recipeId}/images/random`)
    .then(result => dispatch(setRecipeImage(result.body.imageUrl)))
    .catch(err => console.error(err));
};

export const getMyRecipes = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  await request
    .get(`${baseUrl}/users/${user}/recipes`)
    .then(result => {
      dispatch(setMyRecipes(result.body));
    })
    .catch(err => console.error(err));
};
