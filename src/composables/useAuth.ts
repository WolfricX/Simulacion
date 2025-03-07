import { useStorage } from '@vueuse/core';

export const isAuth = () => {
  return useStorage('token', '');
};
