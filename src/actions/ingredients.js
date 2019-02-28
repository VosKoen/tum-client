import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired } from "../jwt";
export const SET_INGREDIENT_LIST = "SET_INGREDIENT_LIST";
export const SET_INGREDIENT_AMOUNT_TYPE_UNIT_LIST = "SET_INGREDIENT_AMOUNT_TYPE_UNIT_LIST";

const setIngredientList = ingredients => {
  return { type: SET_INGREDIENT_LIST, payload: ingredients };
};

const setIngredientAmountTypeUnitList = amountTypeUnits => {
  return { type: SET_INGREDIENT_AMOUNT_TYPE_UNIT_LIST, payload: amountTypeUnits };
};

export const getIngredientList = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/ingredients`)
    .then(result => {
      dispatch(setIngredientList(result.body));
    })
    .catch(err => console.error(err));

  return;
};

export const getIngredientAmountTypeUnitList = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/ingredientAmountTypes`)
    .then(result => {
      dispatch(setIngredientAmountTypeUnitList(result.body));
    })
    .catch(err => console.error(err));

  return;
};
