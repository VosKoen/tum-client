import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired } from "../jwt";

export const SET_RANDOM_RECIPE = "SET_RANDOM_RECIPE";
export const SET_MY_RECIPES = "SET_MY_RECIPES";
export const SET_RECIPE_IMAGE = "SET_RECIPE_IMAGE";

const setRandomRecipe = recipe => {
  return { type: SET_RANDOM_RECIPE, payload: recipe };
};

const setMyRecipes = recipes => {
  return { type: SET_MY_RECIPES, payload: recipes };
};

const setRecipeImage = imageUrl => {
  return { type: SET_RECIPE_IMAGE, payload: { imageUrl } };
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

  if (isExpired(jwt)) dispatch(logout())
  
  const userId = state.user.id;

  await request
    .get(`${baseUrl}/users/${userId}/recipes`)
    .then(result => {
      console.log(result.body)
      dispatch(setMyRecipes(result.body));
    })
    .catch(err => console.error(err));
};
