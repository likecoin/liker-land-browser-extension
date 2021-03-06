/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
// import { debounce } from 'lodash';
import renderComponent from './render';

class YoutubePlugin {
  youtubeStyle!: HTMLElement;

  failCounter!: number;

  insertStyle() {
    this.youtubeStyle = document.createElement('style');
    this.youtubeStyle.innerHTML = `
              #meta-contents {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              }
              .button-container{
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: flex-end;
                height: 100%;
                width: 47%;
                margin-left: 20px;
                text-align: left;
                border-left: 1px solid var(--yt-spec-10-percent-layer);
                padding-left: 14px;
                background: #eaf4f6;
                border: 1px solid #eee;
                padding: 30px;
                box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
                border-radius: 22px;
              }
              li:hover{
                cursor: pointer;
                text-decoration: underline;
              }
              .likecoin-button > div {
                padding-top: 0 !important; 
              }
          `;

    document.body.appendChild(this.youtubeStyle);
    this.failCounter = 0;
  }

  inject() {
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('#meta-contents')) {
      setTimeout(() => {
        this.onPageLoaded();
        this.failCounter += 1;
      }, 100);
    } else {
      let id = this.getLikeId() || '';
      if (id.length === 0) {
        id = 'likertemp';
        this.insertLikeCoinButton(id);
      } else {
        this.insertLikeCoinButton(id);
      }
    }
  }

  private getLikeId() {
    const likeCoTest = new RegExp('button.like.co');
    const desc = document.querySelector('#description');
    const nodes = desc?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    let id = '';
    if (!nodes || nodes?.length === 0) {
      id = 'likertemp';
      return;
    }
    const node = nodes[nodes.length - 1];
    const url = node.innerText;
    // eslint-disable-next-line no-nested-ternary
    id = likeCoTest.test(url)
      ? url.split('/')[url.split('/').length - 1].length > 0
        ? url.split('/')[url.split('/').length - 1]
        : 'likertemp'
      : 'likertemp';
    return id;
  }

  private insertLikeCoinButton(likerId: string) {
    const ele = document.querySelector('#meta-contents') as HTMLElement;
    if (ele.querySelector('.button-container')) {
      return;
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    ele.appendChild(buttonContainer);

    renderComponent(likerId, buttonContainer);
    this.insertStyle();
  }
}
export default YoutubePlugin;
