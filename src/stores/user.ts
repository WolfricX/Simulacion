import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoginService, RegisterService, LogoutService } from '@/services/userService';
import { useStorage } from '@vueuse/core';
import { logService } from '@/services/LogService';
import type { User } from '@/interfaces/User';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({} as User);
  const token = useStorage('token', '');
  const isLoggedIn = computed(() => token.value !== '' && token.value !== undefined);

  async function login(email: string, password: string) {
    try {
      const response = await LoginService(email, password);
      if (response.token) {
        user.value = response;
        token.value = response.token;
      } else {
        throw new Error('Login failed: User not logged in');
      }
    } catch (error: unknown) {
      const errorMessage = 'Error during login';
      console.error(errorMessage, error);
      await logService.log('error', errorMessage, { error, email });
      throw error; // Lanzar error para manejarlo en el componente
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await RegisterService(email, password);
      if (response.status === 200) {
        user.value = response.data;
        token.value = user.value.token;
      }
    } catch (error: unknown) {
      const errorMessage = 'Error during registration';
      console.error(errorMessage, error);
      await logService.log('error', errorMessage, { error, email });
    }
  }

  async function logout() {
    try {
      await LogoutService();
      user.value = {} as User;
      token.value = '';
      localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    } catch (error: unknown) {
      const errorMessage = 'Error during logout';
      console.error(errorMessage, error);
      await logService.log('error', errorMessage, { error });
      throw error; // Lanzar error para manejarlo en el componente
    }
  }

  return { login, register, logout, isLoggedIn, token };
});
