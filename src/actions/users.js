import * as request from "superagent";
import { baseUrl } from "../constants";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGOUT = "USER_LOGOUT";

export const logout = () => ({
  type: USER_LOGOUT
});

const userLoginSuccess = login => ({
  type: USER_LOGIN_SUCCESS,
  payload: login
});

const userLoginFailed = error => ({
  type: USER_LOGIN_FAILED,
  payload: error || "Unknown error"
});



export const login = (email, password) => dispatch =>
  request
    .post(`${baseUrl}/logins`)
    .send({ email, password })
    .then(result => dispatch(userLoginSuccess(result.body)))
    .catch(err => {
      if (err.status === 400) {
        dispatch(userLoginFailed(err.response.body.message));
      } else {
        console.error(err);
      }
    })

export const logoutUser = () => dispatch => {
  return dispatch(logout());
};
