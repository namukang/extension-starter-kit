import { browser } from "webextension-polyfill-ts";

import "images/icon-16.png";
import "images/icon-48.png";
import "images/icon-128.png";

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    return browser.tabs.create({
      url: browser.runtime.getURL("welcome.html"),
    });
  }
});
