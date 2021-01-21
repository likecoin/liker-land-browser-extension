import { browser, Runtime } from 'webextension-polyfill-ts';
import Api from '../../utils/api/like';

class EventCenter {
  portFromCs!: Runtime.Port;

  constructor() {
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  onConnected(p: Runtime.Port) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ctx = this;
    if (p.name === 'port-from-cs') {
      this.portFromCs = p;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.portFromCs.onMessage.addListener((e: { type: string; data: any }) => {
        ctx.onPortMessage(e);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendPortMessage(nid: string, data: any) {
    this.portFromCs.postMessage({ nid, data });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onPortMessage(e: { type: string; data: any }) {
    if (!this.portFromCs) return;
    browser.tabs.onUpdated.addListener(() => {
      this.sendPortMessage('pageLoad', 'pageLoad');
    });
    if (e.type === 'checkLikerId') {
      Api.checkLikerId(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
    if (e.type === 'social') {
      Api.getSoicalUrl(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
    if (e.type === 'like') {
      Api.like(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
    if (e.type === 'total') {
      Api.totalLikesRequest(e.data.content).then(res => {
        this.sendPortMessage(e.data?.nid, res);
      });
    }
  }
}

const eventCenter = new EventCenter();
export default eventCenter;
