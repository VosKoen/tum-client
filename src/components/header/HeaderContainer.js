import * as React from "react";
import { connect } from "react-redux";

class HeaderContainer extends React.PureComponent {


  render() {
    return (
      <div>
          HeaderContainer
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(HeaderContainer);