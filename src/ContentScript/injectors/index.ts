import YoutubePlugin from './youtube.plugin';

class Injector {
  public static injectAll() {
    console.log('=>>>>>>>>>>');
    // inject youtube plugin
    const youtubePlugin = new YoutubePlugin();
    youtubePlugin.inject();
  }
}

export default Injector;
