import * as request from "superagent";
import { baseUrl } from "../constants";

export const SET_RANDOM_RECIPE = "SET_RANDOM_RECIPE";
export const SET_RECIPE_IMAGE = "SET_RECIPE_IMAGE";

const setRandomRecipe = recipe => {
  return { type: SET_RANDOM_RECIPE, payload: recipe };
};

const setRecipeImage = imageUrl => {
  return { type: SET_RECIPE_IMAGE, payload: {imageUrl} };
};

export const getRandomRecipe = () => async dispatch => {
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
