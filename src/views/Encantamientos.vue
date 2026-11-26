<script setup>
import { ref, computed, onMounted } from "vue"

const POR_PAGINA = 10
const encantamientos = ref([])
const total = ref(0)
const pagina = ref(1)
const cargando = ref(false)
const error = ref(null)

const totalPaginas = computed(() => Math.ceil(total.value / POR_PAGINA))

const paginasVisibles = computed(() => {
  const t = totalPaginas.value
  const actual = pagina.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)

  const paginas = [1]
  const inicio = Math.max(2, actual - 1)
  const fin = Math.min(t - 1, actual + 1)

  if (inicio > 2) paginas.push("...")
  for (let i = inicio; i <= fin; i++) paginas.push(i)
  if (fin < t - 1) paginas.push("...")
  paginas.push(t)
  return paginas
})

async function cargar() {
  cargando.value = true
  error.value = null
  try {
    const res = await fetch(
      `https://eldenring.fanapis.com/api/incantations?limit=${POR_PAGINA}&page=${pagina.value - 1}`
    )
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const json = await res.json()
    encantamientos.value = json.data
    total.value = json.total
  } catch (err) {
    error.value = "No se pudieron cargar los encantamientos."
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function irA(n) {
  if (n < 1 || n > totalPaginas.value || n === pagina.value) return
  pagina.value = n
  cargar()
}

onMounted(cargar)
</script>

<template>

  <section id="sec-encan" class="container-sm">
    
    <div v-if="error">
      <p>{{ error }}</p>
      <button class="btn btn-secondary" @click="cargar">Reintentar</button>
    </div>
    
    <!--encantamientos-->
    <div v-else id="encantamientos" class="row g-3" :class="{ 'opacity-50': cargando }">
      <article
        class="card"
        v-for="e in encantamientos"
        :key="e.id"
        role="link"
        tabindex="0"
        style="cursor: pointer"
        @click="$router.push(`/detalle/${e.id}`)"
        @keyup.enter="$router.push(`/detalle/${e.id}`)"
      >
        <img :src="e.image" class="card-img-top" :alt="e.name">
        <div class="card-body">
          <h5 class="card-title">{{ e.name }}</h5>
          <button class="btn btn-primary" @click.stop="guardarFavorito(e)">Guardar</button>
        </div>
      </article>
    </div>

    <p v-if="cargando" class="text-center mt-2">Cargando...</p>

    <!--paginado-->
    <nav v-if="totalPaginas > 1" aria-label="Paginación" class="mt-3 paginacion-custom">
      <ul class="pagination justify-content-center flex-wrap">
        <li class="page-item" :class="{ disabled: pagina === 1 }">
          <button class="page-link" @click="irA(pagina - 1)">&larr;</button>
        </li>

        <li
          v-for="(p, i) in paginasVisibles"
          :key="i"
          class="page-item"
          :class="{ active: p === pagina, disabled: p === '...' }"
        >
          <button class="page-link" @click="p !== '...' && irA(p)">{{ p }}</button>
        </li>

        <li class="page-item" :class="{ disabled: pagina === totalPaginas }">
          <button class="page-link" @click="irA(pagina + 1)">&rarr;</button>
        </li>
      </ul>
    </nav>
  </section>
</template>
