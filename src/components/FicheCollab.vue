<template>
  <div class="container">
    <router-link class="retour" to="/collaborateurs">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>
    <div class="row">
      <div class="col">
        <v-avatar>
          <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-img>
        </v-avatar>
        <h1 class="pt-3 title" v-text="associate.first_name + ' ' +  associate.name"></h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FicheCollab",
  data() {
    return {
      associate: [],
    };
  },
  created() {
    this.associate = this.$route.params.collab;
  },
};
</script>

<style scoped>
</style>