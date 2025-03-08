<template>
  <header class="bg-white shadow-md py-4">
    <div class="container mx-auto px-6">
      <nav class="flex justify-between items-center">
        <div class="text-2xl font-bold text-indigo-600">MiAplicación</div>
        <ul class="flex space-x-4">
          <li v-for="(link, index) in links" :key="index">
            <button
              @click="scrollToSection(link.section)"
              :class="[
                'py-2 px-4 rounded-md transition-colors text-base',
                activeSection === link.section
                  ? 'text-indigo-600 font-bold bg-indigo-100'
                  : 'text-gray-700 hover:text-indigo-500 hover:bg-gray-50',
              ]"
            >
              {{ link.name }}
            </button>
          </li>
          <li v-if="authState">
            <button
              @click="handleLogout"
              class="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors text-base"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/user';

const activeSection = ref('');
const links = ref([
  { name: 'Inicio', section: 'home' },
  { name: 'XSS', section: 'XSS' },
  { name: 'SQL Injection', section: 'SQL_I' },
]);

const authStore = useAuthStore();
const router = useRouter();
const authState = ref<boolean>(authStore.isLoggedIn);

watch(
  () => authStore.isLoggedIn,
  (newVal) => {
    authState.value = newVal;
    console.log('authState updated to:', authState.value);
  },
  { immediate: true }
);

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    activeSection.value = sectionId;
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const elementPosition = section.offsetTop;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    if (!authStore.isLoggedIn) {
      console.log('Logout successful');
      authState.value = false;
      router.push('/');
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

onMounted(() => {
  console.log('Initial authState:', authState.value);
});
</script>
