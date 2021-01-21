/* eslint-disable class-methods-use-this */
import { browser } from 'webextension-polyfill-ts';
import { debounce } from 'lodash';
// import content connector to get message
import contentConnector from './event-center/content-connector';

class PageInjector {
  constructor() {
    contentConnector.init();
    const injectAll = debounce(this.injectInpage.bind(this), 1000);
    window.addEventListener('message', event => {
      if (event.data.nid === 'pageLoad') {
        injectAll();
      }
    });
  }

  injectInpage() {
    const inpage = document.createElement('script');
    inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
    document.body.appendChild(inpage);
  }
}

const pageInjector = new PageInjector();
export default pageInjector;
