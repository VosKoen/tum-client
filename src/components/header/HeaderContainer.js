import * as React from "react";
import { connect } from "react-redux";
import Header from './Header'

import { withStyles } from "@material-ui/core/styles";

class HeaderContainer extends React.PureComponent {


  render() {
    return (
      <div>
          <Header />
      </div>
    );
  }
}

const styles = theme => ({
})

const mapStateToProps = state => ({
});

export default withStyles(styles)(connect(mapStateToProps)(HeaderContainer));