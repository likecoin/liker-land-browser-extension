import { browser } from 'webextension-polyfill-ts';
import * as api from '../utils/api/likerland';

let isLoggedIn = false;

let loginTabId: number | undefined = 0;
const bookmarks = new Set();

async function checkLoginStatus() {
  isLoggedIn = false
  const { data: user } = await api.getLoginStatus();
  if (user) isLoggedIn = true;
}

function handleLikerLandLogin(tabId: number, changeInfo: any) {
  if (loginTabId === tabId && changeInfo && changeInfo.url) {
    isLoggedIn = changeInfo.url.includes('liker.land/following');
    if (isLoggedIn) {
      browser.tabs.remove(tabId)
    }
  }
}

async function addBookMark(url: string) {
  await api.addBookmark(url);
  bookmarks.add(encodeURIComponent(url));
}

async function removeBookMark(url: string) {
  await api.removeBookmark(url);
  bookmarks.delete(encodeURIComponent(url));
}

async function handleBookMark() {
  const [currentTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true, currentWindow: true});
  const currentURL = currentTab && currentTab.url;
  if (!currentURL) {
    console.error('no url');
    console.error(currentTab);
    return;
  }
  if (bookmarks.has(encodeURIComponent(currentURL))) {
    await removeBookMark(currentURL);
  } else {
    await addBookMark(currentURL);
  }
}

async function doLoginViaLikerLand() {
  const tab = await browser.tabs.create({ url: api.getOAuthLoginAPI() });
  loginTabId = tab.id;
  if (!browser.tabs.onUpdated.hasListener(handleLikerLandLogin)) {
    browser.tabs.onUpdated.addListener(handleLikerLandLogin);
  }
}

browser.runtime.onInstalled.addListener(async (): Promise<void> => {
  await checkLoginStatus();
});

browser.runtime.onStartup.addListener(async (): Promise<void>  => {
  await checkLoginStatus();
});

browser.browserAction.onClicked.addListener(async () => {
  if (!isLoggedIn) {
    await doLoginViaLikerLand();
  } else {
    await handleBookMark();
  }
});
