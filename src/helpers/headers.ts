import {authHeader} from './authTokenToLocalstorage';

const headers = (): Headers => {
  return new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeader(),
  })
};

export default headers;
