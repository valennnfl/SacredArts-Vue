<script setup>
import { useGuardados } from "@/components/useGuardados"
const { guardados, alternar } = useGuardados()
</script>

<template>
  <section id="sec-guar" class="py-3">
    <h2>Tus Encantamientos</h2>

    <p class="container-sm" v-if="guardados.length === 0">Todavía no guardaste ningún encantamiento.</p>

    <TransitionGroup name="lista" tag="div" id="e-guardados" class="container-sm row g-3">
      <article
        class="card"
        v-for="g in guardados"
        :key="g.id"
        role="link"
        tabindex="0"
        style="cursor: pointer"
        @click="$router.push(`/detalle/${g.id}`)"
        @keyup.enter="$router.push(`/detalle/${g.id}`)"
      >
        <img :src="g.image" class="card-img-top" :alt="g.name">

        <div class="card-body">
          <h5 class="card-title">{{ g.name }}</h5>

          <button class="btn btn-quitar" @click.stop="alternar(g)">
            Quitar
          </button>
        </div>
      </article>
    </TransitionGroup>
  </section>
</template>