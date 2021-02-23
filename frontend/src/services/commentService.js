import http from './httpService';
import { apiUrl } from '../config.json';

const commentApiEndpoint = apiUrl + '/comments';

export function createComment(comment) {
  return http.post(commentApiEndpoint, comment);
}

export function deleteComment(id) {
  return http.delete(`${commentApiEndpoint}/${id}`);
}

export function likeComment(id, liked) {
  return http.patch(`${commentApiEndpoint}/${id}?likeDelta=${liked ? 1 : -1}`);
}
