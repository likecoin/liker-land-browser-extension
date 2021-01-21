/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
// import { debounce } from 'lodash';
import LikeButton from '../../sdk/button.iframe';
import eventCenter from '../event-center/index';

class YoutubePlugin {
  youtubeStyle!: HTMLElement;

  insertStyle() {
    this.youtubeStyle = document.createElement('style');
    this.youtubeStyle.innerHTML = `
              #meta-contents {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              }
          `;
    document.body.appendChild(this.youtubeStyle);
  }

  inject() {
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('#description')) {
      setTimeout(() => {
        this.onPageLoaded();
      }, 100);
    } else {
      let id = this.getLikeId() || '';
      if (id.length === 0) {
        id = 'likertemp';
        this.insertLikeCoinButton(id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventCenter.sendMessage('checkLikerId', id, (res: any) => {
          if (res.data.status === 200) {
            this.insertLikeCoinButton(id);
            return;
          }
          if (res.data.name === 'Error') {
            id = 'likertemp';
            this.insertLikeCoinButton(id);
          }
        });
      }
    }
  }

  private getLikeId() {
    const desc = document.querySelector('#description');
    const nodes = desc?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    if (nodes.length === 0) return;
    const node = nodes[nodes.length - 1];
    const url = node.innerText;
    const id = url.split('/')[url.split('/').length - 1] || 'likecoin';
    return id;
  }

  private insertLikeCoinButton(likerId: string) {
    if (document.querySelector('.likecoin-button')) return;
    const ele = document.querySelector('#meta-contents') as HTMLElement;
    const buttonEle = document.createElement('div');
    buttonEle.className = likerId;
    ele.append(buttonEle);
    const likeButton = new LikeButton({ likerId, ref: buttonEle });
    likeButton.mount();
    this.insertStyle();
  }
}
export default YoutubePlugin;
