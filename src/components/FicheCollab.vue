<template>
  <div class="container">
    <router-link to="/collaborateurs">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>
    <h1 class="pt-3 title">{{ $route.params.collab.name }}</h1>

  </div>
</template>

<script>
export default {
  name: "FicheCollab",
};
</script>

<style scoped>
</style>