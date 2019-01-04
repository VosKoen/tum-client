import * as React from "react";
import { connect } from "react-redux";

class RecipeFormContainer extends React.PureComponent {


  render() {
    return (
      <div>
          RecipeFormContainer
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(RecipeFormContainer);