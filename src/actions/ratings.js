import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
export const SET_RECIPE_USER_RATING = "SET_RECIPE_USER_RATING";

const setRecipeUserRating = rating => {
  return { type: SET_RECIPE_USER_RATING, payload: rating };
};

export const setRating = (recipeId, recipeIsLiked) => (dispatch, getState) => {
    const state = getState();
    if (!state.user) return null;
    const jwt = state.user.jwt;
  
    if (isExpired(jwt)) return dispatch(logout());
    const user = userId(jwt);

    console.log(recipeIsLiked)
    request
    .post(`${baseUrl}/recipes/${recipeId}/users/${user}/ratings`)
    .send({recipeIsLiked})
    .then(result => 
      dispatch(setRecipeUserRating(result.body.rating))
    )
    .catch(err => console.error(err));

};
