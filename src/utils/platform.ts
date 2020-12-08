// Defined by webpack to be used at compile time
declare const PLATFORM: "firefox" | "chrome";

export const isFirefox = PLATFORM === "firefox";
export const isChrome = PLATFORM === "chrome";
