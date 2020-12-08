import React from "react";

import { isFirefox } from "utils/platform";
import logo from "images/icon.svg";

import "./Welcome.scss";

function Welcome() {
  return (
    <div className="Welcome container-fluid my-5">
      <Logo />
      <h1 className="text-center mb-5">Welcome to Extension Starter Kit</h1>
      Welcome {isFirefox ? "Firefox" : "Chrome"} user!
    </div>
  );
}

function Logo() {
  return (
    <img src={logo} alt="logo" width="64px" className="d-block mx-auto mb-4" />
  );
}

export default Welcome;
