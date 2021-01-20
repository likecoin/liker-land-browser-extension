/**
 * LikeButtonSdk Constructor
 * @config liker info likerId:string ref:HTMLElement | string  href?:string
 */
interface LikeButtonConfig {
  likerId: string;
  ref: HTMLElement;
  href?: string;
  likeStyleElement?: HTMLElement;
}

class LikeCoinButton {
  likerId: string;

  ref: HTMLElement;

  href: string;

  likeStyleElement!: HTMLElement;

  constructor(config: LikeButtonConfig) {
    if (!config || !config.likerId) throw new Error('Missing config.likerId');
    this.likerId = config.likerId;
    this.ref = config.ref;
    this.href = config.href || (window && window.location.href) || '';
    this.insertStyle();
  }

  mount() {
    if (this.ref instanceof HTMLElement === false) {
      this.ref = document.querySelector(`${this.ref}`) as HTMLElement;
    }
    // set like user info
    this.ref.classList.add('likecoin-embed', 'likecoin-button');
    this.ref.setAttribute('data-liker-id', this.likerId);
    this.ref.setAttribute('data-href', this.href);

    this.href = encodeURIComponent(this.href);
    const src = `https://button.like.co/in/embed/${this.likerId}/button?referrer=${this.href}`;

    this.ref.textContent = '';
    this.ref.appendChild(document.createElement('div'));
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    this.ref.appendChild(iframe);
  }

  insertStyle() {
    this.likeStyleElement = document.createElement('style');
    this.likeStyleElement.innerHTML = `
              .likecoin-button {
              margin-right: 0;
              position: relative;
              width: 100%;
              max-width: 485px;
              max-height: 240px;
              height: 100%;
              margin-bottom: 24px;
              padding-bottom: 16px;
              border-bottom: 1px solid var(--yt-spec-10-percent-layer);
              }
              .likecoin-button > div {
              padding-top: 49.48454%;
              }
              .likecoin-button > iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              }
          `;
    document.body.appendChild(this.likeStyleElement);
  }
}

export default LikeCoinButton;
