import { ref, watch } from "vue"

const CLAVE = "guardados-sacred-arts"

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

const guardados = ref(leer())

watch(guardados, (v) => localStorage.setItem(CLAVE, JSON.stringify(v)), { deep: true })

export function useGuardados() {
  const estaGuardado = (id) => guardados.value.some((g) => g.id === id)

  function alternar(e) {
    if (estaGuardado(e.id)) {
      guardados.value = guardados.value.filter((g) => g.id !== e.id)
    } else {
      guardados.value.push({ id: e.id, name: e.name, image: e.image })
    }
  }

  return { guardados, estaGuardado, alternar }
}