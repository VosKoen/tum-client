import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired, userId } from "../jwt";
import { handleError } from './error'

export const SET_INGREDIENT_LIST = "SET_INGREDIENT_LIST";

const setIngredientList = ingredients => {
  return { type: SET_INGREDIENT_LIST, payload: ingredients };
};

export const getIngredientList = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/ingredients`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      dispatch(setIngredientList(result.body));
    })
    .catch(err => 
      handleError(dispatch, err));

  return;
};

export const submitNewIngredientRequest = (ingredient) => async (dispatch, getState) => {

  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  const user = userId(jwt);

  await request
  .post(`${baseUrl}/requested-ingredients`)
  .set("Authorization", `Bearer ${jwt}`)
  .send({request: ingredient,
  userId: user})
  .then()
  .catch(err => handleError(dispatch, err));

}
