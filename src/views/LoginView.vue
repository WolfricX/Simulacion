<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="loginHandler" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            v-model="email"
            v-bind="emailAttrs"
            :class="{ 'border-red-500': errors.email, 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200': true }"
            required
          />
          <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            v-model="password"
            v-bind="passwordAttrs"
            :class="{ 'border-red-500': errors.password, 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200': true }"
            required
          />
          <span v-if="errors.password" class="text-red-500">{{ errors.password }}</span>
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Login
        </button>
      </form>
      <div class="text-center">
        <span class="text-gray-600">Don't have an account?</span>
        <button
          @click="redirectToRegister"
          class="ml-2 text-indigo-600 hover:underline focus:outline-none"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/user';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  }),
});

const [email, emailAttrs] = defineField('email', {
  validateOnModelUpdate: true,
});

const [password, passwordAttrs] = defineField('password', {
  validateOnModelUpdate: true,
});

const router = useRouter();
const authStore = useAuthStore();

const loginHandler = handleSubmit(async (values) => {
  try {
    console.log('Attempting to log in with:', values.email);
    await authStore.login(values.email, values.password);
    if (authStore.isLoggedIn) {
      console.log('Login successful:', authStore.token);
      router.push('/home');
    } else {
      console.log('Login failed: User not logged in');
    }
  } catch (error) {
    console.error('Login failed with error:', error);
  }
});

const redirectToRegister = () => {
  router.push('/register');
};
</script>


