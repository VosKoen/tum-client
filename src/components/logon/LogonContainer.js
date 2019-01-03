import * as React from "react";
import { connect } from "react-redux";
import { login } from "../../actions/users";
import Logon from "./Logon";
import { Redirect } from "react-router-dom";

class LogonContainer extends React.PureComponent {
  handleSubmit = logonData => {
    this.props.login(logonData.email, logonData.password);
  };

  render() {
    if (this.props.user) return <Redirect to="/" />;
    return (
      <div>
        <h1>Logon</h1>
        <Logon handleSubmit={this.handleSubmit} />
        {this.props.error && (
          <span style={{ color: "red" }}>{this.props.error}</span>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  error: state.login.error,
});

export default connect(
  mapStateToProps,
  { login }
)(LogonContainer);
