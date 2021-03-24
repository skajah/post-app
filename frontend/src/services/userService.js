import http from './httpService';
import { apiUrl } from '../config.json';

const userApiEndpoint = apiUrl + '/users';

export function register(user) {
  return http.post(userApiEndpoint, user);
}

export async function getMe(properties, options = {}) {
  const { data: me } = await http.get(
    `${userApiEndpoint}/me?properties=${properties.join(',')}`
  );
  // const { getJwt } = options;
  return me;
}

export function updateMe(data) {
  return http.patch(`${userApiEndpoint}/me`, data);
}

export function getUser(id) {
  return http.get(`${userApiEndpoint}/${id}`);
}

export function getFollowing(id) {
  return http.get(`${userApiEndpoint}/${id}/following`);
}

export function getFollowers(id) {
  return http.get(`${userApiEndpoint}/${id}/followers`);
}
