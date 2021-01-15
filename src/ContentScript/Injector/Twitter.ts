import LikeClap from '../../assets/likecoin-button/like-clap.svg';
import { onReceive, send } from '../Message';

class _Twitter {
  private buttonTemplate: Element | null = null;

  private knownAccounts: Map<string, boolean> = new Map();

  public inject() {
    if (!location.origin.match(/https:\/\/(mobile\.)?twitter\.com/)) return;
    this.onPageLoaded();
  }

  private onPageLoaded() {
    if (!document.querySelector('main')) {
      setTimeout(() => {
        this.onPageLoaded();
      }, 500);
    } else {
      const mutationObserver = new MutationObserver(this.onPageUpdate.bind(this));
      mutationObserver.observe(document.querySelector('main') as Element, { childList: true, subtree: true });
    }
  }

  private onPageUpdate() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]:not([data-likecoin]');

    tweets.forEach(async element => {
      if (element.getAttribute('data-likecoin')) return;

      const originLike = element.querySelector('[data-testid="like"]')!.parentElement!;
      const postMeta = await this.getLinks(element);

      if (!postMeta) {
        element.setAttribute('data-likecoin', 'skip');
        return;
      }

      this.createLikeCoinButton(postMeta!.likerID, postMeta!.postURL)
        .then(cloneLike => {
          originLike.parentElement!.insertBefore(cloneLike, originLike.nextElementSibling);
          element.setAttribute('data-likecoin', 'true');
        })
        .catch(_ => {
          console.debug(`[LikerLand] Create LikeCoin Button for ${postMeta!.postURL} failed, will retry later.`);
        });
    });
  }

  private async getLinks(element: Element): Promise<{ likerID: string; postURL: string } | null> {
    // Links should be [ AvatarLink, UsernameLink, TimestampLink]
    const links = element.querySelectorAll('a');
    const inferUsername = links[0].href.replace('https://twitter.com/', '');
    const inferPostURL = links[2].href;

    if (!this.knownAccounts.has(inferUsername)) {
      const testUsername = await fetch(`https://api.like.co/social/list/${inferUsername}`)
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.twitter && data.twitter.displayName === inferUsername) {
            return true;
          }

          for (const key in data) {
            if (
              key.startsWith('link') &&
              data[key].siteDisplayName == 'twitter' &&
              data[key].url.replace('https://twitter.com/', '').replace('@', '')
            )
              return true;
          }

          return false;
        });
      this.knownAccounts.set(inferUsername, testUsername);
    }

    if (this.knownAccounts.get(inferUsername)) return { likerID: inferUsername, postURL: inferPostURL };
    return null;
  }

  private async createLikeCoinButton(likerID: string, postURL: string): Promise<Element> {
    if (!this.buttonTemplate) this.initTemplate();
    const cloneLike = this.buttonTemplate!.cloneNode(true) as Element;
    const cloneLikeSVG = cloneLike.querySelector('.likecoin-svg')! as HTMLElement;
    const cloneLikeCount = cloneLike.querySelector('.likecoin-count')! as HTMLElement;
    let likeLimit = 5;

    cloneLike.addEventListener('mouseenter', () => {
      (cloneLikeSVG.previousElementSibling! as HTMLElement).style.background = '#aaf1e7';
    });
    cloneLike.addEventListener('mouseleave', () => {
      (cloneLikeSVG.previousElementSibling! as HTMLElement).style.background = '';
    });
    cloneLike.addEventListener('click', () => {
      if (likeLimit <= 0) return;
      likeLimit--;

      cloneLikeSVG.style.color = 'rgb(40, 100, 110)';
      cloneLikeCount.innerHTML = ((parseInt(cloneLikeCount.innerHTML.replace(/,/g, '')) || 0) + 1).toLocaleString();

      send('like', { likerID, postURL });
      onReceive(
        `like:${postURL}`,
        (data: { success: boolean }) => {
          if (!data.success) {
            // Rollback
            const rollbackLikeCount = parseInt(cloneLikeCount.innerHTML.replace(/,/g, '')) - 1;
            cloneLikeCount.innerHTML = rollbackLikeCount > 0 ? rollbackLikeCount.toLocaleString() : '';
          }
        },
        true
      );
    });

    send('query', { likerID, postURL });
    onReceive(
      `query:${postURL}`,
      (data: { selfLikes: number; totalLikes: number; superLike: boolean }) => {
        likeLimit -= data.selfLikes;
        if (data.selfLikes > 0) cloneLikeSVG.style.color = 'rgb(40, 100, 110)';
        if (data.totalLikes > 0) cloneLikeCount.innerHTML = data.totalLikes.toLocaleString();
      },
      true
    );

    return cloneLike;
  }

  private initTemplate() {
    const originLike = document.querySelector('[data-testid="tweet"] [data-testid="like"]')!.parentElement!;
    const cloneLike = originLike.cloneNode(true) as Element;

    const cloneLikeSVG = cloneLike.querySelector('svg')!;
    const likeClapSVG = new DOMParser().parseFromString(LikeClap, 'text/html').body.firstChild as HTMLElement;
    cloneLike.setAttribute('data-testid', 'likecoin-like');
    cloneLikeSVG.setAttribute('viewBox', likeClapSVG.getAttribute('viewBox')!);
    cloneLikeSVG.innerHTML = likeClapSVG.innerHTML;
    cloneLikeSVG.classList.add('likecoin-svg');

    const cloneLikeCount = cloneLike.querySelector('span > span')!;
    cloneLikeCount.innerHTML = '';
    cloneLikeCount.classList.add('likecoin-count');

    this.buttonTemplate = cloneLike;
  }
}

const Twitter = new _Twitter();
export default Twitter;
