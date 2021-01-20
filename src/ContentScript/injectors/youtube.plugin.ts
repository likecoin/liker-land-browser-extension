/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
// import { debounce } from 'lodash';
import LikeButton from '../../sdk/button.iframe';

class YoutubePlugin {
  youtubeStyle!: HTMLElement;

  constructor() {
    console.log('workd');
  }

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
    console.log(this);
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('ytd-app')) {
      setTimeout(() => {
        this.onPageLoaded();
      }, 500);
    } else {
      const id = this.getLikeId() || 'foundation';
      this.insertLikeCoinButton(id);
    }
  }

  private getLikeId() {
    const desc = document.querySelector('#description');
    console.log(desc, this);
    const nodes = desc?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    console.log(nodes);
    if (nodes.length === 0) return;
    const node = nodes[nodes.length - 1];
    const url = node.innerText;
    console.log(url);
    const id = url.split('/')[url.split('/').length - 1] || 'likecoin';
    console.log(id);
    return id;
  }

  private insertLikeCoinButton(likerId: string) {
    if (document.querySelector('.likecoin-button')) return;
    const ele = document.querySelector('#meta-contents') as HTMLElement;
    console.log('ele', ele);
    const buttonEle = document.createElement('div');
    buttonEle.className = likerId;
    ele.append(buttonEle);
    const likeButton = new LikeButton({ likerId, ref: buttonEle });
    likeButton.mount();
    this.insertStyle();
  }
}
export default YoutubePlugin;
