import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const createAxiosInstance = (token: string) => {
  return axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
  });
}; 