<script setup>
import { useRoute } from "vue-router"
import { ref, watch, computed } from "vue"
import { useGuardados } from "@/components/useGuardados"

const route = useRoute()
const e = ref(null)
const cargando = ref(true)
const error = ref(null)
const requisitosActivos = computed(() => {
  if (!Array.isArray(e.value?.requires)) return []
  return e.value.requires.filter(r => r.amount > 0)
})
const { estaGuardado, alternar } = useGuardados()
const nombresStats = {
  Intelligence: 'Inteligencia',
  Faith: 'Fe',
  Arcane: 'Arcano'
}
function traducirStat(nombre) {
  return nombresStats[nombre] ?? nombre
}

async function cargarEncantamiento(id) {
  cargando.value = true
  error.value = null
  e.value = null
  try {
    const res = await fetch(`https://eldenring.fanapis.com/api/incantations/${id}`)
    if (res.status === 404 || res.status === 400) {
      error.value = "no-encontrado"
      return
    }
    if (!res.ok) throw new Error(`Error ${res.status}`)

    const json = await res.json()
    const dato = json.data ?? json
    if (json.success === false || !dato || Array.isArray(dato) || !dato.id) {
      error.value = "no-encontrado"
      return
    }
    e.value = dato
  } catch (err) {
    console.error(err)
    error.value = "conexion"
  } finally {
    cargando.value = false
  }
}

watch(() => route.params.id, (nuevoId) => {
  if (nuevoId) cargarEncantamiento(nuevoId)
}, { immediate: true })
</script>


<template>
  <section id="sec-detalle">
    <p v-if="cargando">Cargando encantamiento...</p>

    <div v-else-if="error === 'no-encontrado'" class="container-sm text-center py-5">
      <h2 class="h-404">404</h2>
      <p>No existe un encantamiento con el id "{{ route.params.id }}".</p>
      <RouterLink to="/" class="btn btn-primary btn-volver">Volver al inicio</RouterLink>
    </div>

    <div v-else-if="error === 'conexion'" class="container-sm text-center py-5">
      <h2>No pudimos cargar el encantamiento</h2>
      <p>Revisá tu conexión o probá de nuevo en unos segundos.</p>
      <button class="btn btn-secondary" @click="cargarEncantamiento(route.params.id)">
        Reintentar
      </button>
    </div>

    <div class="detalle container-sm" v-else-if="e">
      <picture>
        <img :src="e.image" :alt="e.name">
      </picture>
      <div class="detalle-info">
        <h2>{{ e.name }}</h2>
        <h3 v-if="e.description">{{ e.description }}</h3>

        <ul class="elden-stats list-unstyled">
        <li v-if="e.effects">
          <span class="stat-label">Efectos</span>
          <span class="stat-value">{{ e.effects }}</span>
        </li>

        <li v-if="e.cost != null">
          <span class="stat-label">Costo de PC</span>
          <span class="stat-value">{{ e.cost }}</span>
        </li>

        <li v-if="e.slots != null">
          <span class="stat-label">Ranuras</span>
          <span class="stat-value">{{ e.slots }}</span>
        </li>

        <li v-for="(req, idx) in e.requires" :key="req.name ?? idx">
          <span class="stat-label">{{ traducirStat(req.name) }}</span>
          <span class="stat-value" :class="{ 'stat-zero': req.amount === 0 }">
            {{ req.amount }}
          </span>
        </li>
      </ul>
      <button
        class="btn"
        :class="estaGuardado(e.id) ? 'btn-quitar' : 'btn-primary'"
        @click="alternar(e)"
      >
        {{ estaGuardado(e.id) ? "Quitar de guardados" : "Guardar" }}
      </button>

      </div>
    </div>
  </section>
</template>