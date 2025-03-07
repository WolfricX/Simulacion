<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md text-center">
      <h2 class="text-2xl font-bold text-center">404</h2>
      <p class="text-gray-600">Esta pagina no esxites chavo.</p>
      <button
        @click="redirectToHome"
        class="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        Go to Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Redirect to Home page
const redirectToHome = () => {
  router.push('/');
};
</script>
