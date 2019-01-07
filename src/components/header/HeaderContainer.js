import * as React from "react";
import { connect } from "react-redux";
import Header from './Header'

class HeaderContainer extends React.PureComponent {


  render() {
    return (
      <div>
          <Header />
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(HeaderContainer);