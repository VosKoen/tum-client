import * as request from "superagent";
import { baseUrl } from "../constants";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGOUT = "USER_LOGOUT";

export const USER_SIGNUP_SUCCESS = "USER_SIGNUP_SUCCESS";
export const USER_SIGNUP_FAILED = "USER_SIGNUP_FAILED";
export const RESET_USER_SIGNUP = "RESET_USER_SIGNUP";

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

const userSignupFailed = error => ({
  type: USER_SIGNUP_FAILED,
  payload: error || "Unknown error"
});

const userSignupSuccess = () => ({
  type: USER_SIGNUP_SUCCESS
});

export const resetUserSignup = () => ({
  type: RESET_USER_SIGNUP
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
		.then(result => dispatch(resetUserSignup()));

export const signup = (email, password) => dispatch =>
  request
    .post(`${baseUrl}/users`)
    .send({ email, password })
    .then(result => {
      dispatch(userSignupSuccess());
    })
    .catch(err => {
      if (err.status === 400) {
        dispatch(userSignupFailed(err.response.body.message));
      } else {
        console.error(err);
      }
    });
