import http from './httpService';
import { commentApiEndpoint } from '../config.json';

export function getComments(postId) {
  return http.get(`${commentApiEndpoint}?postId=${postId}`);
}
