<template>
  <div class="container">

    <h1 class="title pt-3">Ajouter des attributs</h1>
    <div class="row">
      <v-col cols="12" lg="2" md="4" sm="12">
        <Diplome />
      </v-col>
      <v-col cols="12" lg="2" md="4" sm="12">
        <Jobs />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="12">
        <Genres />
      </v-col>
    </div>
  </div>
  <myToolBar />
</template>

<script>
// Components
import Parametre from "@/components/parameters/Parametre.vue";
import myToolBar from "@/components/MyToolbar.vue";
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
import Genres from "@/components/parameters/Genre.vue";
export default {
  name: "ParametreView",

  components: {
    Parametre,
    myToolBar,
    Diplome,
    Jobs,
    Genres,
},
};
</script>

<style scoped>
</style>