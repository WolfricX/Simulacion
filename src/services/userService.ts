import { genericRequest, genericRequestAutheticated } from '../utils/genericRequest';
import { logService } from './LogService';
import { AxiosError } from 'axios';

const base_url = import.meta.env.VITE_ENDPOINT_API ?? 'http://localhost:3000';

const handleError = async (error: AxiosError, context: string) => {
  const errorMessage = `Error during ${context}: ${error.message}`;
  console.error(errorMessage);

  const errorDetails = {
    response: error.response
      ? {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        }
      : null,
    request: error.request || null,
    message: error.message,
  };

  await logService.log('error', errorMessage, errorDetails);
  throw error;
};

export const LoginService = async (email: string, password: string) => {
  try {
    const response = await genericRequest(`${base_url}/users/login`, 'POST', { email, password });
    console.log('Service response:', response);
    if (response.token) {
      localStorage.setItem('token', response.token); // Almacena el nuevo token en el almacenamiento local
      return response; // Retornar la respuesta si el login es exitoso
    } else {
      throw new Error('Login failed: User not logged in'); // Lanzar un error si no hay token
    }
  } catch (error) {
    await handleError(error as AxiosError, 'login');
  }
};

export const RegisterService = async (email: string, password: string) => {
  try {
    return await genericRequest(base_url + '/users/register', 'POST', { email, password })
  } catch (error) {
    await handleError(error as AxiosError, 'registration')
  }
}


export const LogoutService = async () => {
  try {
    return await genericRequestAutheticated(Headers, base_url + '/users/logout', 'POST')
  } catch (error) {
    await handleError(error as AxiosError, 'logout')
  }
}
