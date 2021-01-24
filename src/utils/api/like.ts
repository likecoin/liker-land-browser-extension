/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-shadow */
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'https://like.co',
  timeout: 10000,
  withCredentials: true,
});

const soicalApi = axios.create({
  baseURL: 'https://api.like.co',
  timeout: 10000,
  withCredentials: true,
});

const Api = {
  checkLikerId: (likerID: string) => {
    return api
      .get(`/${window.encodeURIComponent(likerID)}`)
      .then(res => {
        return res;
      })
      .catch((reason: AxiosError) => {
        return reason;
      });
  },
  selfLikesRequest: (content: { likerID: any; postURL: any }) => {
    return api.get(`/api/like/likebutton/${content.likerID}/self?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  totalLikesRequest: (content: { likerID: any; postURL: any }) => {
    return api.get(`/api/like/likebutton/${content.likerID}/total?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  superLikeRequest: (content: { postURL: any }) => {
    return api.get(`/api/like/share/self?referrer=${content.postURL}`).then(res => {
      return res.data;
    });
  },
  like: (content: { likerID: string; postURL: string }) => {
    return api
      .post(`/api/like/likebutton/${content.likerID}/like?referrer=${content.postURL}&cookie_support=0`)
      .then(res => {
        if (res.data === 'OK') {
          return res.data;
        }
      })
      .catch((reason: AxiosError) => {
        return reason.response;
      });
  },
  getSoicalUrl: (content: { likerID: string }) => {
    return soicalApi.get(`/social/list/${content.likerID}`).then(res => {
      return res;
    });
  },
};

export default Api;
