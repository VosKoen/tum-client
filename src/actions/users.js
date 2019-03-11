import * as request from "superagent";
import { baseUrl } from "../constants";
import { isExpired, userId } from "../jwt";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGOUT = "USER_LOGOUT";
export const SET_USER_PROFILE_DATA = "SET_USER_PROFILE_DATA";

export const SET_NEW_PASSWORD_SUCCESS = "SET_NEW_PASSWORD_SUCCESS";
export const SET_NEW_PASSWORD_FAILED = "SET_NEW_PASSWORD_FAILED";

const setUserProfileData = user => ({
  type: SET_USER_PROFILE_DATA,
  payload: user
});

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

const setNewPasswordSuccess = () => ({
  type: SET_NEW_PASSWORD_SUCCESS
})

const setNewPasswordFailed = message => ({
  type: SET_NEW_PASSWORD_FAILED,
  payload: message
})

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
    });

export const logoutUser = () => dispatch => {
  return dispatch(logout());
};

export const getAccountData = () => (dispatch, getState) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());
  const user = userId(jwt);

  request
    .get(`${baseUrl}/users/${user}`)
    .then(result => {
      dispatch(setUserProfileData(result.body));
    })
    .catch(err => console.error(err));
};

export const setNewPassword = (password, newPassword) => (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.user) return null;
  const jwt = state.user.jwt;

  if (isExpired(jwt)) return dispatch(logout());
  const user = userId(jwt);

  request
    .put(`${baseUrl}/users/${user}/new-password`)
    .send({ password, newPassword })
    .then(() => dispatch(setNewPasswordSuccess()))
    .catch(err => {
        dispatch(setNewPasswordFailed(err.response.body.message));
      })
    }
