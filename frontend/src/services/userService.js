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
