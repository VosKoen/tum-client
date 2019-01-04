import * as React from "react";
import { connect } from "react-redux";

class RecipeViewContainer extends React.PureComponent {


  render() {
    return (
      <div>
          Recipe View Container
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(RecipeViewContainer);
