import { browser } from 'webextension-polyfill-ts';
import * as api from '../utils/api/likerland';
import {
  refreshBookmark,
  addBookMark,
  removeBookMark,
  isBookMarked,
} from './bookmarks';

let isLoggedIn = false;

let loginTabId: number | undefined = 0;
let activeTabId: number | undefined = 0;


async function getCurrentTabURL() {
  const [currentTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true, currentWindow: true});
  // TODO: handle canonical url and url qs cleaning
  const currentURL = currentTab && currentTab.url;
  if (!currentURL) {
    console.error('no url');
    console.error(currentTab);
    return '';
  }
  return currentURL;
}

async function updateBookmarkIcon(url?: string) {
  if (!isLoggedIn) return; // do not change icon if not logged in
  let currentURL = url;
  if (!url) {
    currentURL = await getCurrentTabURL();
  }
  if (currentURL && isBookMarked(currentURL)) {
    browser.browserAction.setIcon({ path: '/assets/icons/bookmark-48.png' });
    browser.browserAction.setTitle({ title: 'Unbookmark'});
  } else {
    browser.browserAction.setIcon({ path: '/assets/icons/bookmark_border-48.png' });
    browser.browserAction.setTitle({ title: 'Bookmark' });
  }
}

async function checkLoginStatus() {
  isLoggedIn = false
  const { data: user } = await api.getLoginStatus();
  if (user) {
    isLoggedIn = true;
    await refreshBookmark();
    await updateBookmarkIcon();
  } else {
    browser.browserAction.setIcon({ path: '/assets/icons/favicon-48.png' });
    browser.browserAction.setTitle({ title: 'Login to liker.land'});
  }
}

function handleLikerLandLogin(tabId: number, changeInfo: any) {
  if (loginTabId === tabId && changeInfo && changeInfo.url) {
    isLoggedIn = changeInfo.url.includes('liker.land/following');
    if (isLoggedIn) {
      browser.tabs.remove(tabId)
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

async function toggleBookMark() {
  const currentURL = await getCurrentTabURL();
  if (!currentURL) return;
  if (isBookMarked(currentURL)) {
    await removeBookMark(currentURL);
  } else {
    await addBookMark(currentURL);
  }
  updateBookmarkIcon(currentURL);
}

browser.runtime.onInstalled.addListener(async (): Promise<void> => {
  await checkLoginStatus();
});
browser.runtime.onStartup.addListener(async (): Promise<void>  => {
  await checkLoginStatus();
});

browser.tabs.onUpdated.addListener((tabId: number, changeInfo: any) => {
  if (activeTabId && tabId === activeTabId && changeInfo.status === 'loading') {
      updateBookmarkIcon(changeInfo.url);
  }
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
    activeTabId = activeInfo.tabId;
    const currentTab = await browser.tabs.get(activeInfo.tabId);
    const currentURL = currentTab && currentTab.url;
    updateBookmarkIcon(currentURL)
});

browser.browserAction.onClicked.addListener(async () => {
  if (!isLoggedIn) {
    await loginViaLikerLand();
  } else {
    await toggleBookMark();
  }
});

function exposeFunctions() {
  // allow window.<function> access from option page
  (<any>window).logout = logout;
}
exposeFunctions();
