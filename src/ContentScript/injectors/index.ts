/* eslint-disable no-restricted-globals */
import YoutubePlugin from './youtube.plugin';

class Injector {
  public static injectAll() {
    if (location.hostname === 'www.youtube.com') {
      // init button in next loop;
      setTimeout(() => {
        const youtubePlugin = new YoutubePlugin();
        youtubePlugin.inject();
      }, 0);
    }
  }
}

export default Injector;
