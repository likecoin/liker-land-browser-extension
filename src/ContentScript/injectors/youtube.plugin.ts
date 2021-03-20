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
    let id = this.getLikeId() || '';
    if (id.length === 0) {
      id = 'likertemp';
      this.insertLikeCoinButton(id);
    } else {
      this.insertLikeCoinButton(id);
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

    renderYouTubeButton(likerId, buttonContainer);
    this.insertStyle();
  }
}
export default YoutubePlugin;
