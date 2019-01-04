import * as React from "react";
import { connect } from "react-redux";

class NavContainer extends React.PureComponent {


  render() {
    return (
      <div>
          NavContainer
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(NavContainer);