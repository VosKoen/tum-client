import * as request from "superagent";
import { baseUrl } from "../constants";
import { logout } from "./users";
import { isExpired } from "../jwt";
import { handleError } from './error'

export const SET_LABEL_LIST = "SET_LABEL_LIST";

const setLabelList = labels => {
  return { type: SET_LABEL_LIST, payload: labels };
};

export const getLabelList = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  await request
    .get(`${baseUrl}/labels`)
    .set("Authorization", `Bearer ${jwt}`)
    .then(result => {
      dispatch(setLabelList(result.body));
    })
    .catch(err => 
      handleError(dispatch, err));

  return;
};