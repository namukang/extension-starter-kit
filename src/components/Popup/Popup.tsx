import { browser } from "webextension-polyfill-ts";
import React from "react";

import "./Popup.scss";

function Popup() {
  return (
    <div className="Popup mt-5 mx-4 text-center">
      Popup!
      <div className="mb-3">
        <SettingsButton />
      </div>
    </div>
  );
}

function SettingsButton() {
  return (
    <button
      type="button"
      className="btn btn-link btn-sm"
      onClick={(e) => {
        e.preventDefault();
        browser.runtime.openOptionsPage();
      }}
    >
      Settings
    </button>
  );
}

export default Popup;
