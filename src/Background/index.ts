import { browser } from 'webextension-polyfill-ts';
import * as api from '../utils/api/likerland';
import { refreshBookmark, addBookmark, removeBookmark, isBookmarked } from './bookmarks';
import eventCenter from './event-center/index';

let isLoggedIn = false;

let loginTabId: number | undefined;

async function getCurrentTabURL() {
  const [currentTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true, currentWindow: true });
  // TODO: handle canonical url and url qs cleaning
  const currentURL = currentTab && currentTab.url;
  if (!currentURL) {
    return '';
  }
  return currentURL;
}

function setBookmarkedIcon(isBookmarkedIcon: boolean) {
  if (isBookmarkedIcon) {
    browser.browserAction.setIcon({ path: '/assets/icons/bookmarked.png' });
    browser.browserAction.setTitle({ title: 'Unbookmark' });
  } else {
    browser.browserAction.setIcon({ path: '/assets/icons/normal.png' });
    browser.browserAction.setTitle({ title: 'Bookmark' });
  }
}

async function updateBookmarkIcon(url?: string) {
  if (!isLoggedIn) return; // do not change icon if not logged in
  let currentURL = url;
  if (!url) {
    currentURL = await getCurrentTabURL();
  }
  setBookmarkedIcon(!!currentURL && isBookmarked(currentURL));
}

async function checkLoginStatus() {
  isLoggedIn = false;
  let user;
  try {
    ({ data: user } = await api.getLoginStatus());
  } catch (err) {
    if (err?.response?.status !== 404) console.error(err);
  }
  if (user) {
    isLoggedIn = true;
    await refreshBookmark();
    await updateBookmarkIcon();
  } else {
    browser.browserAction.setIcon({ path: '/assets/icons/favicon-48.png' });
    browser.browserAction.setTitle({ title: 'Login to liker.land' });
  }
}

function handleLikerLandLogin(tabId: number, changeInfo: any) {
  if (loginTabId === tabId && changeInfo && changeInfo.url) {
    isLoggedIn = changeInfo.url.includes('liker.land/following');
    if (isLoggedIn) {
      browser.tabs.remove(tabId);
    }
  }
}

async function loginViaLikerLand() {
  const tab = await browser.tabs.create({ url: api.getOAuthLoginAPI() });
  loginTabId = tab.id;
  if (!browser.tabs.onUpdated.hasListener(handleLikerLandLogin)) {
    browser.tabs.onUpdated.addListener(handleLikerLandLogin);
  }
}

async function logout() {
  try {
    await api.logout();
  } catch (err) {
    if (err?.response?.status !== 404) console.error(err);
  }
  await checkLoginStatus();
}

async function toggleBookmark(currentURL: string) {
  if (!currentURL) return;
  if (isBookmarked(currentURL)) {
    setBookmarkedIcon(false);
    await removeBookmark(currentURL);
  } else {
    setBookmarkedIcon(true);
    await addBookmark(currentURL);
  }
}

browser.runtime.onInstalled.addListener(
  async (): Promise<void> => {
    await checkLoginStatus();
  }
);
browser.runtime.onStartup.addListener(
  async (): Promise<void> => {
    await checkLoginStatus();
  }
);

browser.tabs.onUpdated.addListener(async id => {
  const currentTab = await browser.tabs.get(id);
  const currentURL = currentTab && currentTab.url;
  eventCenter.sendPortMessage('pageLoad', currentURL);
  updateBookmarkIcon();
});
browser.tabs.onActivated.addListener(async activeInfo => {
  const currentTab = await browser.tabs.get(activeInfo.tabId);
  const currentURL = currentTab && currentTab.url;
  eventCenter.sendPortMessage('pageLoad', currentURL);
  updateBookmarkIcon(currentURL);
});
browser.windows.onFocusChanged.addListener(() => {
  updateBookmarkIcon();
});

browser.browserAction.onClicked.addListener(async () => {
  const currentURL = await getCurrentTabURL();
  /* try to refresh login status first due to persistent: off */
  if (!isLoggedIn) await checkLoginStatus();
  if (!isLoggedIn) {
    await loginViaLikerLand();
  } else {
    try {
      await toggleBookmark(currentURL);
    } catch (err) {
      console.error(err);
    }
  }
});

function exposeFunctions() {
  // allow window.<function> access from option page
  // TODO: add type definition
  (window as any).logout = logout;
}
exposeFunctions();
