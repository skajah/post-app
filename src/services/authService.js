// import http from './httpService';
// import { authEndPoint } from '../config.json';
import jwtDecode from 'jwt-decode';
import sign from 'jwt-encode';

const tokenKey = 'token';
const secret = 'secret';

// get rid of bi-directional dependency
// http.setJwt(getJwt());

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function login(user) {
  const jwt = sign(user, secret);
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt,
};
