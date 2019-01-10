import * as React from "react";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

class FooterContainer extends React.PureComponent {


  render() {
    return (
      <div>
          Footer Container
      </div>
    );
  }
}

const styles = theme => ({
})

const mapStateToProps = state => ({
});

export default withStyles(styles)(connect(mapStateToProps)(FooterContainer));
