import http from './httpService';
import { apiUrl } from '../config.json';

const userApiEndpoint = apiUrl + '/users';

export function register(user) {
  return http.post(userApiEndpoint, {
    email: user.email,
    username: user.username,
    password: user.password,
  });
}

export function getMe() {
  return http.get(`${userApiEndpoint}/me`);
}

export function updateMe(data) {
  return http.patch(`${userApiEndpoint}/me`, data);
}
