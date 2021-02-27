/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { browser } from 'webextension-polyfill-ts';
// import { debounce } from 'lodash';
import contentConnector from './event-center/content-connector';

// let hidden: any;
// let visibilityChange: any;
// if (typeof document.hidden !== 'undefined') {
//   // Opera 12.10 and Firefox 18 and later support
//   hidden = 'hidden';
//   visibilityChange = 'visibilitychange';
// } else if (typeof document.hidden !== 'undefined') {
//   hidden = 'msHidden';
//   visibilityChange = 'msvisibilitychange';
//   // @ts-ignore
// } else if (typeof document.webkitHidden !== 'undefined') {
//   hidden = 'webkitHidden';
//   visibilityChange = 'webkitvisibilitychange';
// }

class PageInjector {
  recursiveQueue: NodeJS.Timeout[] = [];

  constructor() {
    contentConnector.init();
    this.recursiveQueue = [];
    this.recursiveAddButton();
  }

  recursiveAddButton() {
    if (document.querySelector('.button-container')) {
      const timeOut = setTimeout(() => {
        this.recursiveAddButton();
      }, 1000);
      this.recursiveQueue.push(timeOut);
    } else {
      this.injectInpage();
      const timeOut = setTimeout(() => {
        this.recursiveAddButton();
      }, 1000);
      this.recursiveQueue.push(timeOut);
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
