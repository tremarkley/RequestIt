import React from 'react';
import PropTypes from 'prop-types';

const login = props => (
  // <button onClick={props.loginClick}>Log in with Spotify</button>
  <a href="authenticate/login">Log in with Spotify</a>
);

login.propTypes = {
  loginClick: PropTypes.func.isRequired,
};

export default login;
