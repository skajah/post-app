import http from './httpService';
import { apiUrl } from '../config.json';

const postApiEndpoint = apiUrl + '/posts';

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

export function createPost(post) {
  return http.post(postApiEndpoint, post);
}

export function deletePost(id) {
  return http.delete(`${postApiEndpoint}/${id}`);
}

export function likePost(id, liked) {
  return http.patch(`${postApiEndpoint}/${id}?likeDelta=${liked ? 1 : -1}`);
}
