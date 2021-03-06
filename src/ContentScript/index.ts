/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { browser } from 'webextension-polyfill-ts';
import contentConnector from './event-center/content-connector';

class PageInjector {
  recursiveQueue: number[] = [];

  constructor() {
    contentConnector.init();
    this.recursiveQueue = [];
    this.recursiveAddButton();
  }

  recursiveAddButton() {
    if (document.querySelector('.button-container')) {
      // @ts-ignore
      const timeOut: number = setTimeout(() => {
        this.recursiveAddButton();
      }, 1000);
      this.recursiveQueue.push(timeOut);
    } else {
      this.injectInpage();
      const timeOut = setTimeout(() => {
        this.recursiveAddButton();
      }, 1000);
      // @ts-ignore
      this.recursiveQueue.push(timeOut);
    }
  }

  injectInpage() {
    // eslint-disable-next-line no-restricted-globals
    if (location.hostname === 'www.youtube.com') {
      const inpage = document.createElement('script');
      inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
      document.body.appendChild(inpage);
    }
  }
}

const pageInjector = new PageInjector();
export default pageInjector;
