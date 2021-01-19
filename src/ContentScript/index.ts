import { browser } from 'webextension-polyfill-ts';

// import content connector to get message
import contentConnector from './event-center/content-connector';

contentConnector.init();

function injectInpage() {
  const inpage = document.createElement('script');
  inpage.src = browser.runtime.getURL('js/inpage.bundle.js');
  debugger;
  document.body.appendChild(inpage);
}
injectInpage();
