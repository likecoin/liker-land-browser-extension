/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
// import { debounce } from 'lodash';
import { renderYouTubeButton } from './render';

class YoutubePlugin {
  youtubeStyle!: HTMLElement;

  insertStyle() {
    this.youtubeStyle = document.createElement('style');
    this.youtubeStyle.innerHTML = `
              #meta-contents {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding-top:40px;
              }
              .button-container{
                width: 605px;
                margin-left: 20px;
                padding: 11px;
                padding-left: 14px;
                background: #eaf4f6;
                border: 1px solid #eee;
                border-left: 1px solid #eee;
                border-radius: 22px;
                box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
                box-sizing: content-box;
                text-align: left;
              }
              .tips-list:hover{
                cursor: pointer;
                text-decoration: underline;
              }
              .liker-button{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
              @media (max-width:1400px){
                #meta-contents {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }
                .button-container{
                  display: flex;
                  flex-direction: row;
                  justify-content: flex-end;
                  align-items: flex-end;
                  width: 700px;
                  margin-left: 20px;
                  padding: 15px;
                }
                .button-container > div{
                  display: flex;
                  flex-direction: row !important;
                }
                .liker-tips{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                }
                .liker-tips-content{
                  margin: 0 !important;
                }
              }
          `;

    document.body.appendChild(this.youtubeStyle);
  }

  inject() {
    this.onPageLoaded();
  }

  private onPageLoaded() {
    const id = this.getLikeId() || '';
    if (id) {
      this.insertLikeCoinButton(id);
    }
  }

  private getLikeId() {
    const likeCoTest = new RegExp('https://button.like.co/([a-z0-9-_]{7,20})');
    const descs = document.querySelectorAll('#description');
    const desc = Array.from(descs).find(d => {
      return d.innerHTML.includes('button.like.co');
    });
    if (!desc) return '';
    const res = desc.innerHTML.match(likeCoTest);
    if (!res) return '';
    const [, likerId] = res;
    return likerId;
  }

  private insertLikeCoinButton(likerId: string) {
    const descs = document.querySelectorAll('#description');
    let ele = Array.from(descs).find(d => {
      return d.innerHTML.includes('button.like.co');
    });
    if (!ele) return;
    while (ele.lastElementChild) {
      ele = ele.lastElementChild;
    }
    if (ele.querySelector('.button-container')) {
      return;
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    ele.appendChild(buttonContainer);

    renderYouTubeButton(likerId, buttonContainer);
    this.insertStyle();
  }
}
export default YoutubePlugin;
