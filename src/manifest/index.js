const pkg = require('../../package.json');
const manifestInput = {
  manifest_version: 2,
  name: 'Liker Land',
  version: pkg.version,

  icons: {
    '16': 'assets/icons/favicon-16.png',
    '32': 'assets/icons/favicon-32.png',
    '48': 'assets/icons/favicon-48.png',
    '128': 'assets/icons/favicon-128.png',
  },

  description: 'Browser extension for liker.land',
  homepage_url: 'https://liker.land',
  short_name: 'Liker Land',

  permissions: ['tabs', 'http://*/*', 'https://*/*'],
  content_security_policy: "script-src 'self'; object-src 'self'",

  '__chrome|firefox__author': 'Republic of Liker Land',
  __opera__developer: {
    name: 'Republic of Liker Land',
  },

  __firefox__applications: {
    gecko: { id: '{017584ac-81f4-4868-98c5-66f8e26f25d5}' },
  },

  __chrome__minimum_chrome_version: '49',
  __opera__minimum_opera_version: '36',

  browser_action: {
    default_icon: {
      '16': 'assets/icons/favicon-16.png',
      '32': 'assets/icons/favicon-32.png',
      '48': 'assets/icons/favicon-48.png',
      '128': 'assets/icons/favicon-128.png',
    },
    default_title: 'Login to liker.land',
    '__chrome|opera__chrome_style': false,
    __firefox__browser_style: false,
  },

  '__chrome|opera__options_page': 'options.html',

  options_ui: {
    page: 'options.html',
    open_in_tab: true,
    __chrome__chrome_style: false,
  },

  background: {
    scripts: ['js/background.bundle.js'],
    '__chrome|opera__persistent': false,
  },

  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['js/contentScript.bundle.js'],
    },
  ],

  web_accessible_resources: ['js/inpage.bundle.js', 'assets/likecoin-button/like-clap.svg'],
};

module.exports = manifestInput;
