<template>
  <v-container>

    <Simulation /> 
  </v-container>
</template>

<script>
// Components
import Simulation from "@/components/Simulation.vue";
export default {
  name: "FicheClientView",

  components: {
    Simulation,
  },
};
</script>

<style scoped>
</style>