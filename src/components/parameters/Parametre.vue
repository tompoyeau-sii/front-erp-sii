<template>
  <div class="container">
    <h1 class="title pt-3">Ajouter des attributs</h1>
    <Diplome />
    <Jobs />
  </div>
</template>

<script>
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
export default {
  name: "Parametres",
  Diplome,
  Jobs,
};
</script>

<style scoped>
</style>
