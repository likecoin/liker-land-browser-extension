/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { browser } from 'webextension-polyfill-ts';
// import { debounce } from 'lodash';
import contentConnector from './event-center/content-connector';

let hidden: any;
let visibilityChange: any;
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.hidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

class PageInjector {
  constructor() {
    contentConnector.init();
    const injectAll = this.injectInpage.bind(this);
    // inject on load
    window.onload = () => {
      // @ts-ignore
      if (!document[hidden]) {
        injectAll();
      }
    };
    // inject on message
    window.addEventListener('message', event => {
      // eslint-disable-next-line no-restricted-globals
      if (event.data.nid === 'pageLoad' && event.data.data === location.href) {
        injectAll();
      }
    });

    // inject on visibility
    function handleVisibilityChange() {
      // @ts-ignore
      if (!document[hidden]) {
        injectAll();
      }
    }
    if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
      console.log(
        'This script requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
      );
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
  }

  injectInpage() {
    const inpage = document.createElement('script');
    inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
    document.body.appendChild(inpage);
  }
}

const pageInjector = new PageInjector();
export default pageInjector;
