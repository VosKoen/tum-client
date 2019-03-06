import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
export const SET_RECIPE_USER_RATING = "SET_RECIPE_USER_RATING";

export const setRecipeUserRating = userRatingResult => {
  return { type: SET_RECIPE_USER_RATING, payload: userRatingResult };
};

export const setRating = (recipeId, recipeIsLiked) => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());
  const user = userId(jwt);

  request
    .post(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .send({ recipeIsLiked })
    .then(result => 
      dispatch(setRecipeUserRating({recipeIsLiked: result.body.recipeIsLiked, newRating: result.body.newRating})))
    .catch(err => console.error(err));
};
