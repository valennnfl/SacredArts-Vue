<script setup>
import { useRoute } from "vue-router"
import { ref, watch } from "vue"
import { computed } from "vue"

const route = useRoute()
const e = ref(null)
const cargando = ref(true)
const error = ref(null)
const requisitosActivos = computed(() => {
  if (!Array.isArray(e.value?.requires)) return []
  return e.value.requires.filter(r => r.amount > 0)
})

const nombresStats = {
  Intelligence: 'Inteligencia',
  Faith: 'Fe',
  Arcane: 'Arcano'
}
function traducirStat(nombre) {
  return nombresStats[nombre] ?? nombre
}

async function cargarEncantamiento(id) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  cargando.value = true
  error.value = null
  try {
    const res = await fetch(`https://eldenring.fanapis.com/api/incantations/${id}`)
    if (!res.ok) throw new Error("No se pudo cargar el encantamiento")
    const json = await res.json()
    e.value = json.data ?? json
  } catch (err) {
    error.value = err.message
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
    <p v-else-if="error">{{ error }}</p>
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

      </div>
    </div>
  </section>
</template>