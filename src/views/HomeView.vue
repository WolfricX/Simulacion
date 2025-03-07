<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import navbarComponent from '../components/navbarComponent.vue';

// Componentes
const componentsMap: { [key: string]: ReturnType<typeof defineAsyncComponent> } = {
  XSS: defineAsyncComponent(() => import('../components/Attacks/XSSComponent.vue')),
  SQL_I: defineAsyncComponent(() => import('../components/Attacks/SQL_IComponent.vue')),
};

const activeSection = ref('XSS');
const headerHeight = ref(0);

// Función para obtener la altura del header
const updateHeaderHeight = () => {
  const header = document.querySelector('header');
  if (header) {
    headerHeight.value = header.offsetHeight;
  }
};

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    activeSection.value = sectionId;
    const offset = headerHeight.value;
    const elementPosition = section.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const handleScroll = () => {
  const sections = Object.keys(componentsMap);
  const offset = headerHeight.value + 20; // Agregamos un pequeño margen

  for (const sectionId of sections) {
    const section = document.getElementById(sectionId);
    if (section) {
      const position = section.getBoundingClientRect();
      if (position.top <= offset && position.bottom >= offset) {
        activeSection.value = sectionId;
        break;
      }
    }
  }
};

// Debounce function para optimizar scroller
const debounce = (fn: (...args: unknown[]) => void, ms = 100) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const debouncedScroll = debounce(handleScroll);
const attacks: string[] = Object.keys(componentsMap);

onMounted(() => {
  updateHeaderHeight();
  window.addEventListener('scroll', debouncedScroll);
  window.addEventListener('resize', updateHeaderHeight);
});

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll);
  window.removeEventListener('resize', updateHeaderHeight);
});
</script>

<template>

  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header fijo -->
    <navbarComponent>
      <template #lista>
        <nav class="overflow-x-auto bg-white shadow-md py-4">
          <ul class="flex space-x-4 px-4 whitespace-nowrap">
            <li v-for="section in attacks" :key="section">
              <button @click="scrollToSection(section)" :class="[
                'py-2 px-4 rounded-md transition-colors text-base',
                activeSection == section
                  ? 'text-indigo-600 font-bold bg-indigo-100'
                  : 'text-gray-700 hover:text-indigo-500 hover:bg-gray-50',
              ]">
                {{ section }}
              </button>
            </li>
          </ul>
        </nav>
      </template>
    </navbarComponent>

    <!-- Contenido principal -->
    <main :style="{ paddingTop: `${headerHeight}px` }" class="flex-grow">
      <div class="container mx-auto px-6 py-6">
        <component v-for="section in attacks" :id="section" :key="section" :is="componentsMap[section]"
          class="component-wrapper mb-12 p-6 md:p-8 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg">
        </component>
      </div>
    </main>

    <!-- Pie de página -->

  </div>
</template>

<style scoped>
.component-wrapper {
  min-height: calc(100vh - var(--header-height, 64px));
  border: 1px solid var(--color-primary);
}

/* Estilos para el scroll horizontal en dispositivos móviles */
nav {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

nav::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}

/* Media queries para responsividad */
@media (max-width: 640px) {
  .component-wrapper {
    margin-bottom: 0.5rem;
    padding: 1rem;
  }
}
</style>
