import * as React from "react";
import { connect } from "react-redux";

class SignupContainer extends React.PureComponent {


  render() {
    return (
      <div>
          SignupContainer
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(SignupContainer);