import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LogonContainer from "./components/logon/LogonContainer";
import SignupContainer from "./components/signup/SignupContainer";
import NavContainer from "./components/navigation/NavContainer";
import HeaderContainer from "./components/header/HeaderContainer";
import FooterContainer from "./components/footer/FooterContainer";
import RecipeFormContainer from "./components/recipe-form/RecipeFormContainer";
import RecipeViewContainer from "./components/recipe-view/RecipeViewContainer";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {/* <HeaderContainer /> */}
          </header>
          <nav>
            {/* <NavContainer /> */}
          </nav>
          <main>
            {/* <Route exact path="/" component={RecipeViewContainer} />
            <Route exact path="/recipe-form" component={RecipeFormContainer} /> */}
            <Route exact path="/logon" component={LogonContainer} />
            {/* <Route exact path="/signup" component={SignupContainer} /> */}
          </main>
          <footer>
            {/* <FooterContainer /> */}
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
