import axios from 'axios';

import { LIKER_LAND_API_BASE } from '../../constant';

const api = axios.create({
  baseURL: 'https://api.like.co',
  timeout: 10000,
  withCredentials: true,
});

export function getUserSoicalMedia(user: string) {
  return api.get(`/social/list/${user}`);
}
