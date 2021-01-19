import { browser, Runtime } from 'webextension-polyfill-ts';

const IDENTIFIER = 'liker-land-extension';

class ContentConnector {
  port!: Runtime.Port;

  init() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.port = browser.runtime.connect({ name: 'port-from-cs' });
    window.addEventListener('message', event => {
      if (event.source !== window || !event.data || event.data._identifier !== IDENTIFIER) return;
      this.postBgMessage(event.data.action, event.data);
    });
    this.onBgMessage();
  }

  postBgMessage(type: string, data: any) {
    if (typeof data !== 'object') return;
    this.port.postMessage({ type, data });
  }

  onBgMessage() {
    this.port.onMessage.addListener(e => {
      e.type = 'response';
      window.postMessage(e, window.location.origin);
    });
  }
}
const contentConnector = new ContentConnector();

export default contentConnector;
