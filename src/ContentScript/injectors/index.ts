/* eslint-disable no-restricted-globals */
import YoutubePlugin from './youtube.plugin';

class Injector {
  public static injectAll() {
    if (location.hostname === 'www.youtube.com') {
      if (document.querySelector('.button-container')) {
        const ele = document.querySelector('.button-container') as HTMLElement;
        if (!ele.parentElement) return;
      }
      // init button in next loop;
      setTimeout(() => {
        const youtubePlugin = new YoutubePlugin();
        youtubePlugin.inject();
      }, 0);
    }
  }
}

export default Injector;
