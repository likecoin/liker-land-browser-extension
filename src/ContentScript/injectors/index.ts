/* eslint-disable no-restricted-globals */
import YoutubePlugin from './youtube.plugin';
// import eventCenter from '../event-center/index';

class Injector {
  public static injectAll() {
    if (location.hostname === 'www.youtube.com') {
      const youtubePlugin = new YoutubePlugin();
      youtubePlugin.inject();
    }

    // inject youtube plugin
  }
}

export default Injector;
