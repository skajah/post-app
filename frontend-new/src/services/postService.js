import http from './httpService';
import { apiUrl } from '../config.json';

const postApiEndpoint = apiUrl + '/posts';

export function getPosts() {
  return http.get(postApiEndpoint);
}

export function getUserPosts(id) {
  return http.get(`${postApiEndpoint}?userId=${id}`);
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

export function likePost(id) {
  return http.patch(`${postApiEndpoint}/${id}`, { liked: true });
}

export function unlikePost(id) {
  return http.patch(`${postApiEndpoint}/${id}`, { liked: false });
}
