import http from './httpService';
import { userApiEndpoint } from '../config.json';

export function getUserFromId(id) {
  return http.get(`${userApiEndpoint}/${id}`);
}
