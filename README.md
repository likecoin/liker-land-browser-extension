# Liker Land Browser Extension

Integrate [Liker Land](https://liker.land) functionality into your favorite browsers.

## Features

- Bookmark any URL into Liker Land reading list
- Auto inject Liker button for youtube videos. Copy and paste you Liker button URL into the video description field for this to work! Video without a Liker button URL will be injected with a temporary Liker button, which you can claim later.

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](https://addons.mozilla.org/firefox/addon/kutt/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](CONTRIBUTING.md#for-opera-users) | [![Yandex](https://raw.github.com/alrra/browser-logos/master/src/yandex/yandex_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![vivaldi](https://raw.github.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) |
![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 49 & later ✔ | 52 & later ✔ | 36 & later ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔

## 🚀 Quick Start

- `yarn install` to install dependencies.
- `yarn run dev:chrome` to start the development server for chrome extension.
- `yarn run dev:firefox` to start the development server for firefox addon.
- `yarn run dev:opera` to start the development server for opera extension.
- `yarn run build:chrome` to build chrome extension.
- `yarn run build:firefox` to build firefox addon.
- `yarn run build:opera` to build opera extension.
- `yarn run build` builds and packs extensions all at once to extension/ directory.

## Development

- `yarn install` to install dependencies.
- To watch file changes in developement

  - Chrome
    - `yarn run dev:chrome`
  - Firefox
    - `yarn run dev:firefox`
  - Opera
    - `yarn run dev:opera`

- **Load extension in browser**

  - ### Chrome

    - Go to the browser address bar and type `chrome://extensions`
    - Check the `Developer Mode` button to enable it.
    - Click on the `Load Unpacked Extension…` button.
    - Select your extension’s extracted directory.

  - ### Firefox

    - Load the Add-on via `about:debugging` as temporary Add-on.
    - Choose the `manifest.json` file in the extracted directory

  - ### Opera

    - Load the extension via `opera:extensions`
    - Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

### Production

- `yarn run build` builds the extension for all the browsers to `extension/BROWSER` directory respectively.

## Credit

Original [template](https://github.com/abhijithvijayan/web-extension-starter/) made by [@abhijithvijayan](https://twitter.com/_abhijithv)

## Licence

Code released under the [GPLv3](LICENSE), original template released under MIT License.
