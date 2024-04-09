<template>
  <v-container>
    <v-row class="p-3">
      <v-col lg="6">
        <h1 class="title d-inline-block">Ajouter des attributs</h1>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <AddAccountForm />
        </v-col>
      </v-row>
    </v-row>

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
    <PdcYear />
  </v-container>
</template>

<script>
// Components
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
import Genres from "@/components/parameters/Genre.vue";
import PdcYear from "@/components/parameters/PdcYear.vue";
import AddAccountForm from "@/components/forms/add/AddAccountForm.vue";
export default {
  name: "ParametreView",

  components: {
    Diplome,
    Jobs,
    Genres,
    PdcYear,
    AddAccountForm,
  },
};
</script>

<style scoped>
</style>