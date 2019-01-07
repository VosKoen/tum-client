import * as React from "react";
import { connect } from "react-redux";
import RecipeImage from './RecipeImage'
import RecipeContent from './RecipeContent'

import { getRandomRecipe } from '../../actions/recipes'

class RecipeViewContainer extends React.PureComponent {

  componentDidMount() {
    this.props.getRandomRecipe();
  }

  render() {
    return (
      <div>
          <RecipeImage />
          <RecipeContent recipe={this.props.recipe} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recipe: state.recipe
});

export default connect(mapStateToProps, {getRandomRecipe})(RecipeViewContainer);
