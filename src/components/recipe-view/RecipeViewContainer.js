import * as React from "react";
import { connect } from "react-redux";
import RecipeImage from './RecipeImage'
import RecipeContent from './RecipeContent'

class RecipeViewContainer extends React.PureComponent {

  render() {
    return (
      <div>
          <RecipeImage />
          <RecipeContent />
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(RecipeViewContainer);
