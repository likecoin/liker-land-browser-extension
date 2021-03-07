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

  callback = (mutationsList: MutationRecord[]) => {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // @ts-ignore
        const timeOut: number = setTimeout(() => {
          this.recursiveAddButton();
        }, 1000);
        this.recursiveQueue.push(timeOut);
      } else if (mutation.type === 'attributes') {
        // @ts-ignore
        const timeOut: number = setTimeout(() => {
          this.recursiveAddButton();
        }, 1000);
        this.recursiveQueue.push(timeOut);
      }
    }
  };

  recursiveAddButton() {
    if (document.querySelector('.button-container')) {
      const ele = document.querySelector('.button-container') as HTMLElement;
      // @ts-ignore
      if (ele.parentElement?.children.length < 2) {
        const timeOut = setTimeout(() => {
          this.recursiveAddButton();
        }, 1000);
        // @ts-ignore
        this.recursiveQueue.push(timeOut);
      }
      const observer = new MutationObserver(this.callback);

      const config = { attributes: true, childList: true, subtree: true };

      observer.observe(document.querySelector('.button-container') as HTMLElement, config);
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
