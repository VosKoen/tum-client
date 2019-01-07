import * as request from "superagent";
import { baseUrl } from "../constants";

export const SET_RANDOM_RECIPE = "SET_RANDOM_RECIPE"

const setRandomRecipe = recipe => {
  return { type: SET_RANDOM_RECIPE, payload: recipe };
};

export const getRandomRecipe = () => dispatch => {
  request
    .get(`${baseUrl}/recipes/random`)
    .then(result => dispatch(setRandomRecipe(result.body)))
    .catch(err => console.error(err));
};
