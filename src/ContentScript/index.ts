/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { browser } from 'webextension-polyfill-ts';
import contentConnector from './event-center/content-connector';

class PageInjector {
  recursiveQueue: number[] = [];

  recursiveNumber = 0;

  constructor() {
    contentConnector.init();
    this.recursiveQueue = [];
    this.recursiveNumber = 0;

    window.addEventListener('message', event => {
      // eslint-disable-next-line no-restricted-globals
      if (event.data.nid === 'pageLoad') {
        setTimeout(() => {
          this.injectInpage();
        }, 3000);
      }
    });
  }

  clearRecursiveQueue() {
    this.recursiveQueue.forEach(item => {
      clearTimeout(item);
    });
  }

  async injectInpage() {
    const res = await new Promise<boolean>(resolve => {
      // eslint-disable-next-line no-restricted-globals
      if (location.hostname === 'www.youtube.com') {
        const inpage = document.createElement('script');
        inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
        document.head.appendChild(inpage);
        inpage.onload = () => {
          resolve(true);
        };
      }
    });
    return res;
  }
}

const pageInjector = new PageInjector();
export default pageInjector;
