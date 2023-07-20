<template>
  <v-container>

    <h1 class="title pt-3">Ajouter des attributs</h1>
    <div class="row">
      <v-col cols="12" lg="3" md="4" sm="6">
        <Diplome />
      </v-col>
      <v-col cols="12" lg="3" md="4" sm="6">
        <Jobs />
      </v-col>
      <v-col cols="12" lg="3" md="4" sm="6">
        <Genres />
      </v-col>
    </div>
  </v-container>
</template>

<script>
// Components
import Parametre from "@/components/parameters/Parametre.vue";
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
import Genres from "@/components/parameters/Genre.vue";
export default {
  name: "ParametreView",

  components: {
    Parametre,
    Diplome,
    Jobs,
    Genres,
},
};
</script>

<style scoped>
</style>