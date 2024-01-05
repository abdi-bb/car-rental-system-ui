import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const refreshToken = async (store) => {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/v1/auth/jwt/refresh',
      { refresh: localStorage.getItem('refreshToken') }
    );
    const responseData = await response.json();
    const decodedAccessToken = jwtDecode(responseData.access);
    const newExpiration = decodedAccessToken.exp * 1000;

    store.commit('setAccessToken', responseData.access);
    store.commit('setTokenExpiration', newExpiration);

    return responseData.access;
  } catch (error) {
    console.error('Access token refresh failed:', error);
    throw error;
  }
};
