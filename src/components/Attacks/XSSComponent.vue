<template>
  <section class="mb-12 p-6 rounded-lg shadow-sm bg-white transition-all duration-300 hover:shadow-md min-h-screen">
    <div id="XSS">
      <h2 class="text-3xl font-bold mb-4 text-center">Cross-Site Scripting (XSS)</h2>
      <p class="mb-4 text-lg text-gray-600">
        XSS permite inyectar scripts maliciosos en páginas web vistas por otros usuarios.
      </p>
      <form @submit.prevent="submitXSS" class="mb-4">
        <label for="xssInput" class="block mb-2 text-gray-700">Introduce un script:</label>
        <input autocomplete="false" id="xssInput" v-model="xssInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
        <button type="submit"
          class="mt-4 w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200">
          Enviar
        </button>
      </form>
      <div v-html="xssOutput" class="prose mb-4"></div>
      <div>
        <h3 class="text-2xl font-bold mb-2">Ejemplos básicos de XSS:</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Bold Text: &lt;strong&gt;Example&lt;/strong&gt;</li>
          <li>Script Injection: &lt;a href=https://userinyerface.com/ class="btn btn-primary mx-2&gt; Clickeame
            &lt;/a&gt;</li>
          <li>Image Injection: &lt;img src=x&gt;</li>
          <li>Script Injection en un Evento de Imagen: &lt;img src=x onmouseover=alert('XSS') /&gt;</li>
          <li>Script Injection en un Atributo de Imagen: &lt;img src=javascript:alert('XSS'); /&gt;</li>
        </ul>
        <h3 class="text-2xl font-bold mb-2">Comentarios inyectados:</h3>
        <ul class="list-disc list-inside">
          <li v-for="(comment, index) in comments" :key="index" class="mb-2">
            <p v-html="comment.comment"></p>
          </li>
        </ul>
      </div>
      <div class="text-center">
        <button @click="show = !show" type="submit"
          class="mt-4 w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
          Mostrar
        </button>
      </div>
      <div v-if="show" class="mt-4">
        <h3 class="text-2xl font-bold mb-2">Prevención de XSS:</h3>
        <p class="mb-2 text-lg text-gray-600">
          Para prevenir XSS, es importante escapar correctamente los datos de entrada y utilizar
          métodos seguros para renderizar contenido HTML.
        </p>
        <ul class="list-disc list-inside text-gray-600">
          <li>Escapar caracteres especiales en el lado del servidor.</li>
          <li>Utilizar bibliotecas de sanitización de HTML.</li>
          <li>Implementar Content Security Policy (CSP).</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCommentsService, addCommentsService } from '@/services/ApiService'

const xssInput = ref('')
const xssOutput = ref('')
const comments = ref<{ comment: string }[]>([])
const show = ref(false)

const submitXSS = async () => {
  try {
    console.log(xssInput.value)
    await addCommentsService(1, xssInput.value) // Cambia 1 por el ID real del usuario si es dinámico
    xssOutput.value = xssInput.value
    xssInput.value = '' // Limpia el campo después de enviar
    fetchComments(true) // Indica que se ha añadido un nuevo comentario
  } catch (error) {
    console.error("Error al enviar comentario", error)
  }
}

const executeScripts = (event: Event) => {
  const scripts = (event.target as Element)?.querySelectorAll('script')
  scripts.forEach((script: HTMLScriptElement) => {
    const newScript = document.createElement('script')
    newScript.text = script.innerText
    document.body.appendChild(newScript)
  })
}

const fetchComments = async (newComment = false) => {
  try {
    const response = await getCommentsService()
    comments.value = response.results
    if (newComment) {
      // Ejecuta los scripts solo para el nuevo comentario
      const lastComment = comments.value[comments.value.length - 1]
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = lastComment.comment
      executeScripts({ target: tempDiv } as unknown as Event)
    }
  } catch (error) {
    console.error("Error al obtener comentarios", error)
  }
}

onMounted(() => {
  fetchComments()
})
</script>
