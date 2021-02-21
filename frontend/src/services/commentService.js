import http from './httpService';
import { apiUrl } from '../config.json';

const commentApiEndpoint = apiUrl + '/comments';

export function getComments(postId) {
  return http.get(`${commentApiEndpoint}?postId=${postId}`);
}
