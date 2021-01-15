import * as api from '../utils/api/soicallink';

export function getUserLink(user: string) {
  const res = api.getUserSoicalMedia(user);
  return res;
}
