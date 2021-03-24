import axios from 'axios';
import { toast } from 'react-toastify';

// includes token whenever we make an http request
// however, create bi-directional dependency. http needs auth and auth need http

axios.interceptors.response.use(null, (error) => {
  const response = error.response;
  const expectedError =
    response && response.status >= 400 && response.status < 500;

  if (!expectedError) {
    console.log('Logging error: ', error);
    toast.error(
      <div>
        An unexpected error occured <br /> {error.message}
      </div>
    );
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  console.log('Setting axios header: jwt = ', jwt);
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  setJwt,
};
