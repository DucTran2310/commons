import axios from 'axios';

export async function login(email: string, password: string) {
  const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
    email,
    password,
  });

  const { access_token, refresh_token } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  return response.data;
}