import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducers";
import { storeJwt } from "./middleware";
import ReduxThunk from "redux-thunk";

const composeEnhancers =
(process.env.REACT_APP_DISABLE_DEVTOOLS && compose ) || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(ReduxThunk, storeJwt)
);

const store = createStore(reducer, enhancer);

export default store;
