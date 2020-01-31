import axios from 'axios';

import {
  LIKER_LAND_API_BASE,
} from '../../constant';

const api = axios.create({
  baseURL: LIKER_LAND_API_BASE,
  timeout: 10000,
  withCredentials: true,
});

export const getAppURL = () => 'https://likecoin.page.link/likeco';

export async function refreshBookmarkList() {
  const { bookmarks } = await api.get('/reader/bookmark');
  return bookmarks;
}

export async function addBookmark(url: string) {
  await api.post(`/reader/bookmark?url=${encodeURIComponent(url)}`);
}

export async function removeBookmark(url: string) {
  await api.delete(`/reader/bookmark?url=${encodeURIComponent(url)}`);
}

export async function getLoginStatus() {
  return await api.get(`/users/self`);
}

export async function logout() {
  await api.post(`/users/logout`);
}

export const getOAuthLoginAPI = () => `${LIKER_LAND_API_BASE}/users/login`;
