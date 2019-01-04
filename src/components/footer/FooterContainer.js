import * as React from "react";
import { connect } from "react-redux";

class FooterContainer extends React.PureComponent {


  render() {
    return (
      <div>
          Footer Container
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(FooterContainer);
