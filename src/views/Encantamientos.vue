<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useGuardados } from "@/components/useGuardados"

const route = useRoute()
const router = useRouter()
const POR_PAGINA = 10
const todosEncantamientos = ref([])
const textoInput = ref(route.query.buscar || "")
const busqueda = ref(route.query.buscar || "")
const categoriaSeleccionada = ref(route.query.categoria || "Todos")
const pagina = ref(Number(route.query.pagina) || 1)
const cargando = ref(false)
const error = ref(null)
const { estaGuardado, alternar } = useGuardados()
const categorias = [
  { nombre: "Todos", valor: "Todos" },
  { nombre: "Fe", valor: "Faith" },
  { nombre: "Inteligencia", valor: "Intelligence" },
  { nombre: "Arcano", valor: "Arcane" }
]

watch([busqueda, categoriaSeleccionada], () => {
  pagina.value = 1
})
watch([busqueda, categoriaSeleccionada, pagina], () => {
  const query = {}
  if (busqueda.value) query.buscar = busqueda.value
  if (categoriaSeleccionada.value !== "Todos") query.categoria = categoriaSeleccionada.value
  if (pagina.value > 1) query.pagina = pagina.value
  router.replace({ query })
})

let temporizador
watch(textoInput, (nuevo) => {
  clearTimeout(temporizador)
  temporizador = setTimeout(() => {
    busqueda.value = nuevo
  }, 400)
})
onUnmounted(() => clearTimeout(temporizador))

const encantamientosFiltrados = computed(() => {
  return todosEncantamientos.value.filter(e => {
    const coincideNombre = (e.name || "")
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())
    const coincideCategoria =
      categoriaSeleccionada.value === "Todos" ||
      (e.requires || []).some(req =>
        req.name === categoriaSeleccionada.value &&
        Number(req.amount) > 0
      )
    return coincideNombre && coincideCategoria
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(encantamientosFiltrados.value.length / POR_PAGINA)
})

const encantamientos = computed(() => {
  const inicio = (pagina.value - 1) * POR_PAGINA

  return encantamientosFiltrados.value.slice(
    inicio,
    inicio + POR_PAGINA
  )
})

const paginasVisibles = computed(() => {
  const t = totalPaginas.value
  const actual = pagina.value

  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)

  const paginas = [1]
  const inicio = Math.max(2, actual - 1)
  const fin = Math.min(t - 1, actual + 1)

  if (inicio > 2) paginas.push("...")

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i)
  }

  if (fin < t - 1) paginas.push("...")

  paginas.push(t)

  return paginas
})

async function cargar() {
  cargando.value = true
  error.value = null

  try {
    const res = await fetch(
      "https://eldenring.fanapis.com/api/incantations?limit=100"
    )

    if (!res.ok) throw new Error(`Error ${res.status}`)

    const json = await res.json()
    todosEncantamientos.value = json.data
    if (pagina.value > totalPaginas.value) pagina.value = 1

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
}

function reiniciarPagina() {
  pagina.value = 1
}

onMounted(cargar)
</script>



<template>
  <section id="sec-encan" class="container-sm">

    <div v-if="error">
      <p>{{ error }}</p>
      <button class="btn btn-secondary" @click="cargar">
        Reintentar
      </button>
    </div>

    <div v-else>

      <!-- búsqueda y filtros -->
      <div id="search-section" class="row g-2 mb-4">

        <div class="col-md-8">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar encantamiento..."
            v-model="textoInput"
          >
        </div>

        <div class="col-md-4">
          <select
            class="form-select"
            v-model="categoriaSeleccionada"
            @change="reiniciarPagina"
          >
            <option
              v-for="cat in categorias"
              :key="cat.valor"
              :value="cat.valor"
            >
              {{ cat.nombre }}
            </option>
          </select>
        </div>

      </div>

      <!-- encantamientos -->
      <div
        id="encantamientos"
        class="row g-3"
        :class="{ 'opacity-50': cargando }"
      >

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

            <button
              class="btn"
              :class="estaGuardado(e.id) ? 'btn-guardado' : 'btn-primary'"
              @click.stop="alternar(e)"
            >
              {{ estaGuardado(e.id) ? "Guardado" : "Guardar" }}
            </button>
          </div>
        </article>

      </div>

      <p v-if="!cargando && encantamientos.length === 0" class="text-center mt-3">
        No se encontraron encantamientos.
      </p>

    </div>

    <p v-if="cargando" class="text-center mt-2">
      Cargando...
    </p>

    <!-- paginado -->
    <nav
      v-if="totalPaginas > 1"
      aria-label="Paginación"
      class="mt-3 paginacion-custom"
    >
      <ul class="pagination justify-content-center flex-wrap">

        <li class="page-item" :class="{ disabled: pagina === 1 }">
          <button class="page-link" @click="irA(pagina - 1)">
            &larr;
          </button>
        </li>

        <li
          v-for="(p, i) in paginasVisibles"
          :key="i"
          class="page-item"
          :class="{ active: p === pagina, disabled: p === '...' }"
        >
          <button class="page-link" @click="p !== '...' && irA(p)">
            {{ p }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: pagina === totalPaginas }">
          <button class="page-link" @click="irA(pagina + 1)">
            &rarr;
          </button>
        </li>

      </ul>
    </nav>

  </section>
</template>