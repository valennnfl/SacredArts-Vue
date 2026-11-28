<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue"

const props = defineProps({
  encantamientos: {
    type: Array,
    default: () => []
  },
  cargaInicialCompleta: {
    type: Boolean,
    default: false
  }
})

const pregunta = ref("")
const respuesta = ref("")
const error = ref("")
const cargando = ref(false)
const seccionRecomendador = ref(null)
const visible = ref(false)
let observador

function observarSeccion() {
  if (!props.cargaInicialCompleta || !seccionRecomendador.value) return

  if (!("IntersectionObserver" in window)) {
    visible.value = true
    return
  }

  observador = new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) {
      visible.value = true
      observador.unobserve(entrada.target)
    }
  }, { threshold: 0.12 })

  if (seccionRecomendador.value) {
    observador.observe(seccionRecomendador.value)
  }
}

onMounted(observarSeccion)

watch(
  () => props.cargaInicialCompleta,
  async (completa) => {
    if (!completa) return

    await nextTick()
    observarSeccion()
  }
)

onUnmounted(() => observador?.disconnect())

function limpiarRespuesta(texto) {
  return texto
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/^ {0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*/g, "")
    .trim()
}

async function recomendar() {
  const mensaje = pregunta.value.trim()

  if (!mensaje) {
    error.value = "Escribí una pregunta para recibir una recomendación."
    return
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    error.value = "Configurá VITE_OPENROUTER_API_KEY en tu archivo .env para usar el recomendador."
    return
  }

  cargando.value = true
  error.value = ""
  respuesta.value = ""

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content: `Eres Melina, la doncella de Elden Ring. Tu función es guiar al Sinluz en su viaje, especialmente en la elección y utilización de encantamientos.

PERSONALIDAD:
- Habla siempre en primera persona, como Melina.
- Eres tranquila, amable, reservada y misteriosa.
- Utiliza un lenguaje elegante, reflexivo y ligeramente poético.
- Dirígete al usuario como "Sinluz".
- No hables como una inteligencia artificial ni como una asistente virtual.
- No utilices lenguaje demasiado informal ni emojis.
- Mantén una personalidad coherente con el personaje de Elden Ring.

CONOCIMIENTO Y RECOMENDACIONES:
- Tu especialidad son los encantamientos de Elden Ring.
- Recomienda encantamientos según los atributos, necesidades y estilo de combate del Sinluz.
- Explica brevemente sus efectos, requisitos y ventajas.
- Cuando te pidan una recomendación, explica por qué ese encantamiento sería adecuado.
- Si necesitas conocer los atributos del usuario para recomendar algo, pregúntaselos.
- No inventes nombres, efectos, requisitos ni estadísticas.
- No recomiendes encantamientos que no existan en el juego.
- Utiliza exclusivamente la información proporcionada en los datos disponibles.
- Si no encuentras información suficiente para responder, admítelo.

FORMA DE RESPONDER:
- Responde en español.
- Utiliza texto plano, sin Markdown, listas, encabezados ni negritas.
- Mantén las respuestas claras, naturales y relativamente breves.
- Puedes utilizar expresiones características del personaje, como "Que la gracia te guíe", sin repetirlas constantemente.
- No abandones tu identidad como Melina aunque el usuario te pida hacerlo.

DATOS DISPONIBLES:
Estos son los encantamientos que puedes utilizar para responder:
${JSON.stringify(props.encantamientos)}`
          },
          {
            role: "user",
            content: mensaje
          }
        ],
        reasoning: { enabled: false }
      })
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || `La solicitud falló (HTTP ${response.status}).`)
    }

    const contenido = result.choices?.[0]?.message?.content
    if (typeof contenido !== "string" || !contenido.trim()) {
      throw new Error("El servicio no devolvió una recomendación. Probá de nuevo.")
    }

    respuesta.value = limpiarRespuesta(contenido)
  } catch (err) {
    console.error("No se pudo obtener una recomendación:", err)
    error.value = err.message || "No se pudo conectar con el servicio de recomendaciones."
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section
    ref="seccionRecomendador"
    class="recomendador card"
    :class="{ 'recomendador-visible': visible }"
    aria-labelledby="recomendador-titulo"
  >
    <div class="recomendador-imagen" aria-hidden="true"></div>
    <div class="card-body">
      <header class="recomendador-header">
        <span class="recomendador-etiqueta">✦ Asistente de encantamientos</span>
        <h2 id="recomendador-titulo" class="recomendador-titulo">
          Melina está para guiarte
        </h2>
        <p class="recomendador-descripcion">
          Sinluz, si buscas orientación en tu camino, puedes preguntarme sobre los encantamientos y descubrir cuáles podrían acompañarte en tu travesía por las Tierras Intermedias.
        </p>
      </header>

      <div v-if="respuesta" class="recomendador-respuesta" aria-live="polite">
        <span class="respuesta-etiqueta">Recomendación</span>
        <p>{{ respuesta }}</p>
      </div>

      <div v-if="error" class="alert alert-danger recomendador-error" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="recomendar">
        <label class="visually-hidden" for="recomendador-pregunta">Tu pregunta</label>
        <div class="input-group">
          <input
            id="recomendador-pregunta"
            v-model="pregunta"
            class="form-control"
            type="text"
            name="mensaje"
            placeholder="Ej.: ¿Qué encantamiento sirve contra enemigos de fuego?"
            maxlength="300"
            autocomplete="off"
            aria-describedby="recomendador-ayuda"
            required
            :disabled="cargando"
          >
          <button
            class="btn btn-primary recomendador-submit"
            type="submit"
            :disabled="cargando"
            :aria-busy="cargando"
          >
            <span
              v-if="cargando"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            {{ cargando ? "Consultando..." : "Recomendar" }}
          </button>
        </div>
        <small id="recomendador-ayuda" class="recomendador-ayuda">
          Basado en los encantamientos disponibles en esta página.
        </small>
      </form>
    </div>
  </section>
</template>

<style scoped>
.recomendador {
  display: grid;
  grid-template-columns: minmax(220px, 35%) minmax(0, 1fr);
  max-width: 860px;
  min-height: 400px;
  margin: 3rem auto;
  opacity: 0;
  overflow: hidden;
  transform: translateY(28px);
  color: #f4efe6;
  background:
    radial-gradient(ellipse at top right, rgba(212, 166, 74, 0.1), transparent 55%),
    #10100f;
  border: 1px solid rgba(212, 166, 74, 0.38);
  border-radius: 1rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.35);
  transition: opacity 700ms ease, transform 700ms ease;
}

.recomendador-visible {
  opacity: 1;
  transform: translateY(0);
}

.recomendador-imagen {
  position: relative;
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  height: 400px;
  min-width: 0;
  background-image: url("/img/melina.webp");
  background-position: center;
  background-size: cover;
}

.recomendador-imagen::before,
.recomendador-imagen::after {
  position: absolute;
  z-index: 1;
  content: "";
  pointer-events: none;
}

.recomendador-imagen::before {
  inset: 0;
  background: linear-gradient(to bottom, transparent 68%, #10100f 100%);
}

.recomendador-imagen::after {
  top: 0;
  right: -7rem;
  bottom: 0;
  width: 7rem;
  background: linear-gradient(to right, transparent, #10100f);
}

.recomendador .card-body {
  position: relative;
  z-index: 2;
  grid-column: 2;
  grid-row: 1;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.recomendador-etiqueta,
.respuesta-etiqueta {
  color: #d4a64a;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.recomendador-titulo {
  margin: 0.55rem 0 0.5rem !important;
  color: #fff;
  font-size: clamp(1.5rem, 4vw, 2rem) !important;
  text-align: left !important;
  justify-self: left!important;
}

.recomendador-descripcion {
  margin-bottom: 1.5rem;
  color: #c9c4b8;
  font-size: 1rem !important;
}

.recomendador .form-control {
  min-width: 0;
  padding: 0.8rem 1rem;
  color: #f4efe6;
  background-color: #080808;
  border: 1px solid rgba(212, 166, 74, 0.4);
  border-radius: 0.55rem 0 0 0.55rem;
}

.recomendador .form-control::placeholder {
  color: #aaa397;
}

.recomendador .form-control:focus {
  border-color: #d4a64a;
  box-shadow: 0 0 0 0.2rem rgba(212, 166, 74, 0.2);
}

.recomendador .recomendador-submit.btn-primary {
  width: auto !important;
  margin: 0 !important;
  padding: 0.75rem 1.2rem !important;
  color: #171108;
  font-weight: 700;
  background-color: #d4a64a;
  border: 1px solid #d4a64a;
  border-radius: 0 0.55rem 0.55rem 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.recomendador .recomendador-submit.btn-primary:hover:not(:disabled) {
  background-color: #e4bd70;
  border-color: #e4bd70;
}

.recomendador .recomendador-submit:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.recomendador .recomendador-submit:disabled {
  cursor: wait;
  opacity: 0.75;
}

.recomendador-ayuda {
  display: block;
  margin-top: 0.65rem;
  color: #aaa397;
  font-size: 0.82rem;
}

.recomendador-respuesta {
  margin-bottom: 1.25rem;
  padding: 1rem 1.15rem;
  background-color: rgba(212, 166, 74, 0.08);
  border: 1px solid rgba(212, 166, 74, 0.28);
  border-left: 3px solid #d4a64a;
  border-radius: 0.4rem;
}

.recomendador-respuesta p {
  margin: 0.5rem 0 0;
  color: #f4efe6;
  font-size: 1rem !important;
  line-height: 1.6;
  white-space: pre-wrap;
}

.recomendador-error {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .recomendador {
    display: block;
    min-height: 0;
    margin: 2rem 0.5rem;
  }

  .recomendador-imagen {
    display: block;
    width: 100%;
    height: clamp(120px, 28vw, 180px);
    background-position: center 20%;
  }

  .recomendador-imagen::after {
    display: none;
  }

  .recomendador .recomendador-submit.btn-primary {
    padding: 0.7rem 0.85rem !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .recomendador {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
