<template>
  <section class="mb-12 p-6 rounded-lg shadow-sm bg-white transition-all duration-300 hover:shadow-md min-h-screen">
    <div id="SQL_I">
      <h2 class="text-3xl font-bold mb-4 text-center">SQL Injection (SQL_I)</h2>
      <p class="mb-4 text-lg text-gray-600">
        SQL Injection permite inyectar consultas SQL maliciosas en la base de datos.
      </p>
      <form @submit.prevent="submitSQLI" class="mb-4">
        <label for="sqlInput" class="block mb-2 text-gray-700">Introduce un nombre de item:</label>
        <input autocomplete="false" id="sqlInput" v-model="sqlInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
        <label for="sqlDescription" class="block mb-2 text-gray-700">Introduce una descripción:</label>
        <input autocomplete="false" id="sqlDescription" v-model="sqlDescription"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
        <button type="submit"
          class="mt-4 w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200">
          Enviar
        </button>
      </form>
      <div>
        <h3 class="text-2xl font-bold mb-2">Items:</h3>
        <ul class="list-disc list-inside mb-4">
          <li v-for="(item, index) in items" :key="index" class="mb-2">
            <p>{{ item.name }}: {{ item.description }}</p>
            <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">Eliminar</button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAttackStore } from '@/stores/attacks'

const sqlInput = ref('')
const sqlDescription = ref('')
const attackStore = useAttackStore()
interface Item {
  id: number;
  name: string;
  description: string;
}

const items = ref<Item[]>([])

const submitSQLI = async () => {
  try {
    await attackStore.createItem(sqlInput.value, sqlDescription.value)
    sqlInput.value = ''
    sqlDescription.value = ''
  } catch (error) {
    console.error("Error al enviar item", error)
  }
}

const deleteItem = async (id: number) => {
  try {
    await attackStore.deleteItem(id)
  } catch (error) {
    console.error("Error al eliminar item", error)
  }
}

onMounted(async () => {
  try {
    items.value = await attackStore.getAllItems() as unknown as Item[]
  } catch (error) {
    console.error("Error al obtener items", error)
  }
})
</script>
