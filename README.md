# Extension Starter Kit

🔥 Starter kit for building Chrome/Firefox extensions

### Supported

- Typescript
- React
- Bootstrap
- CSS Modules
- Live reloading

## How It Works

The extension starter kit uses [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) which allows you to build extensions that automatically work on both Chrome and Firefox!

### Content Scripts

An example content script is included in `src/contentScripts/example.ts`. Webpack outputs processed files as `[name].bundle.js`, so in `manifest.json`, the content script is loaded as `example.bundle.js`.

After loading Extension Starter Kit, visit http://example.com and open the console to see the example content script in action.

## Development

### Chrome

1. Run `npm run develop` to start webpack-dev-server
2. Open `chrome://extensions/` and load the extension in the `dist-dev` directory

The following parts of the extension will be automatically updated through live reload / hot module replacement:

- Background script
- Extension pages (e.g. options.html)

Content scripts will **not** be automatically updated (unless loaded into non-SSL pages) and will require a refresh.

### Firefox

1. Run `npm run develop-firefox` to start webpack-dev-server
2. Load `build/manifest.json` at `about:debugging#/runtime/this-firefox`

## Releasing

1. Bump the version number in `package.json`
2. Create a git tag called `v${version}` using `git tag -a v<version>`
3. Run `npm run build` (Chrome) or `npm run build-firefox` (Firefox) to create a production build inside the `dist-prod` directory.
4. Upload the zip to the Chrome developer dashboard and Firefox addons site

If a copy of the source code is required, run `npm run zip-source`
