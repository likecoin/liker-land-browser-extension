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
        this.injectInpage().then(() => {
          this.observer();
        });
      }
    });
  }

  callback = (mutationsList: MutationRecord[]) => {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // @ts-ignore
        const timeOut: number = setTimeout(() => {
          this.injectInpage();
        }, 1000);
        this.recursiveQueue.push(timeOut);
      }
    }
  };

  observer() {
    if (document.querySelector('.button-container')) {
      const ele = document.querySelector('#meta-contents') as HTMLElement;
      // @ts-ignore
      if (ele?.children.length < 2) {
        const timeOut = setTimeout(() => {
          this.injectInpage();
        }, 1000);
        // @ts-ignore
        this.recursiveQueue.push(timeOut);
      }
      const observer = new MutationObserver(this.callback);

      const config = { attributes: true, childList: true, subtree: true };

      observer.observe(ele, config);
    } else {
      const timeOut = setTimeout(() => {
        this.recursiveNumber += 1;
        this.observer();
      }, 1000);
      // @ts-ignore
      this.recursiveQueue.push(timeOut);
    }
  }

  injectInpage() {
    return new Promise<boolean>(resolve => {
      // eslint-disable-next-line no-restricted-globals
      if (location.hostname === 'www.youtube.com') {
        const inpage = document.createElement('script');
        inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
        document.body.appendChild(inpage);
        inpage.onload = () => {
          resolve(true);
        };
      }
    });
    // eslint-disable-next-line no-restricted-globals
  }
}

const pageInjector = new PageInjector();
export default pageInjector;
