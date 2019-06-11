import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LogonContainer from "./components/logon/LogonContainer";
import SignupContainer from "./components/signup/SignupContainer";
import NavContainer from "./components/navigation/NavContainer";
import FooterContainer from "./components/footer/FooterContainer";
import RecipeFormContainer from "./components/recipe-form/RecipeFormContainer";
import RecipeViewContainer from "./components/recipe-view/RecipeViewContainer";
import MyRecipesViewContainer from "./components/my-recipes-view/MyRecipesViewContainer";
import MyAccountContainer from "./components/account/MyAccountContainer";
import ErrorPageContainer from "./components/error/ErrorPageContainer";
import HeadChefsViewContainer from "./components/head-chefs-view/HeadChefsViewContainer";

class App extends Component {

  render() {

    return (
      <Router>
        <div className="App">
          <nav>
            <NavContainer />
          </nav>
          <main>
            <Route exact path="/" component={RecipeViewContainer} />
            <Route exact path="/recipe-form" component={RecipeFormContainer} />
            <Route exact path="/my-head-chefs" component={HeadChefsViewContainer} />
            <Route
              exact
              path="/my-recipes"
              component={MyRecipesViewContainer}
            />
            <Route exact path="/my-account" component={MyAccountContainer} />
            <Route exact path="/logon" component={LogonContainer} />
            <Route exact path="/signup" component={SignupContainer} />
            <Route exact path="/error" component={ErrorPageContainer} />
          </main>
          <footer>
            <FooterContainer />
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
