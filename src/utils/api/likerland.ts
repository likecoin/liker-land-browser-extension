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

export async function refreshBookmarkList() : Promise<string[]> {
  const { data } = await api.get('/reader/bookmark');
  return data?.bookmarks || [];
}

export function addBookmark(url: string) {
  return api.post(`/reader/bookmark?url=${encodeURIComponent(url)}`);
}

export function removeBookmark(url: string) {
  return api.delete(`/reader/bookmark?url=${encodeURIComponent(url)}`);
}

export function getLoginStatus() {
  return api.get(`/users/self`);
}

export function logout() {
  return api.post(`/users/logout`);
}

export const getOAuthLoginAPI = () => `${LIKER_LAND_API_BASE}/users/login`;
