<script setup>
import {ref} from "vue"

const encantamientos = ref([])
  fetch("https://eldenring.fanapis.com/api/incantations")
    .then(res => res.json())
    .then(data => {
      encantamientos.value = data
    })
    .catch(err => console.log(err))
</script>

<template>

<!-- sección encantamientos -->
  <div class="container-xl">

    <div id="encantamientos" class="row g-3"></div>
  </div>

</template>

<style scoped></style>
