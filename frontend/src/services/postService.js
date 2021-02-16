import http from './httpService';
import { postApiEndpoint } from '../config.json';

export function getPosts() {
  return http.get(postApiEndpoint);
}

export function getPost(id) {
  return http.get(`${postApiEndpoint}/${id}`);
}

export function deletePost(id) {
  return http.delete(`${postApiEndpoint}/${id}`);
}
