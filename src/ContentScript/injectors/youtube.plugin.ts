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
                // border-bottom: 1px solid var(--yt-spec-10-percent-layer);
              }
              .button-conatiner {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: flex-end;
                height: 100%;
                width: 47%;
                margin-left: 20px;
                text-align:left;
                border-left: 1px solid var(--yt-spec-10-percent-layer);
                padding-left: 14px;
              }
              .button-conatiner a{
              }
              .liker-tips{
                text-align: left;
                z-index: 10;
              }
              .liker-tips-title{
                cursor: pointer;
                -webkit-transition: opacity,color .2s ease-in-out;
                transition: opacity,color .2s ease-in-out;
                color: #28646e;
                font-size: 16px;
                line-height: 1.5em;
                font-weight: 600;
              }
              .liker-tips-title a {
                color: #28646e;
              }
              .liker-tips-content{
                color: #4a4a4a;
                font-size: 12px;
              }
          `;
    document.body.appendChild(this.youtubeStyle);
  }

  inject() {
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('#meta-contents')) {
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
    setTimeout(() => {
      const ele = document.querySelector('#meta-contents') as HTMLElement;
      if (ele.querySelector('.likecoin-embed')) {
        return;
      }
      const buttonEle = document.createElement('div');
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-conatiner';
      buttonEle.className = likerId;
      ele.appendChild(buttonContainer);
      buttonContainer.appendChild(buttonEle);
      if (likerId === 'likertemp') {
        const tips = document.createElement('div');
        tips.className = 'liker-tips';
        const tipsTitle = document.createElement('div');
        tipsTitle.className = 'liker-tips-title';
        tipsTitle.innerHTML = `你的 Like 已被存儲在公共錢包，请到 <a href="https://discord.com/invite/W4DQ6peZZZ">Discord 频道</discord> 驗證身份就能取回`;
        const tipsContent = document.createElement('div');
        tipsContent.innerHTML = ` 為什麼這是妳專屬的贊助基金？我們實際根據已經觀看者的 Like 統計，已經將妳的讚賞基金暂存，驗證這是你的內容即可領取，快來 <a style="color: #28646e;" href="https://liker.land/getapp?"> LikerLand <a/> 建立錢包，馬上收到來自粉絲的贊助！`;
        tipsContent.className = 'liker-tips-content';
        tips.appendChild(tipsTitle);
        tips.appendChild(tipsContent);
        buttonContainer.appendChild(tips);
      }
      const likeButton = new LikeButton({ likerId, ref: buttonEle });
      likeButton.mount();
      this.insertStyle();
    }, 0);
  }
}
export default YoutubePlugin;
