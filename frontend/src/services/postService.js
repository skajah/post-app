import http from './httpService';
import { postApiEndpoint } from '../config.json';

export function getPosts({ numberOfComments }) {
  return http.get(
    `${postApiEndpoint}${numberOfComments ? '?numberOfComments=true' : ''}`
  );
}

export function getPost(id, { withComments }) {
  return http.get(
    `${postApiEndpoint}/${id}${withComments ? '?withComments=true' : ''}`
  );
}

export function deletePost(id) {
  return http.delete(`${postApiEndpoint}/${id}`);
}
