/* eslint-disable no-restricted-globals */
import YoutubePlugin from './youtube.plugin';
// import eventCenter from '../event-center/index';

class Injector {
  public static injectAll() {
    console.log('=>>1');
    if (location.hostname === 'www.youtube.com') {
      console.log('=>>2');
      if (document.querySelector('.button-container')) {
        console.log('=>>3');
        const ele = document.querySelector('.button-container') as HTMLElement;
        if (!ele.parentElement) return;
        // ele.parentElement.removeChild(ele);
      }
      // init button in next loop;
      setTimeout(() => {
        const youtubePlugin = new YoutubePlugin();
        youtubePlugin.inject();
      }, 1000);
    }

    // inject youtube plugin
  }
}

export default Injector;
