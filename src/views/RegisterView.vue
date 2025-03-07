<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Register</h2>
      <form @submit.prevent="registerHandler" class="space-y-4">
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
          Register
        </button>
      </form>
      <div class="text-center">
        <span class="text-gray-600">Already have an account?</span>
        <button
          @click="redirectToLogin"
          class="ml-2 text-indigo-600 hover:underline focus:outline-none"
        >
          Login
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

// Define validation schema
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

// Router instance
const router = useRouter();
const authStore = useAuthStore();

// Register handler
const registerHandler = handleSubmit(async (values) => {
  try {
    console.log('Attempting to register with:', values.email);
    await authStore.register(values.email, values.password);
    console.log('Registration successful');
    // Redirigir a la página de inicio de sesión después de un registro exitoso
    router.push('/');
  } catch (error) {
    console.error('Registration failed with error:', error);
  }
});


// Redirect to Login page
const redirectToLogin = () => {
  router.push('/');
};
</script>
