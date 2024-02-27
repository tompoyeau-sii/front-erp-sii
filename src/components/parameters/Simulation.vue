<template>
  <p>
    Le mode simulation vous permet de modifier toutes les données comme vous le
    souhaitez. Ce mode n'impacte en rien les données de la version classique de
    PICSOU. La simulation utilise une base de données complétement indépendante.
    Afin que les données restent à jour, le serveur de base de données importe
    automatiquement tous les lundi les données de la version "prod". Vous pouvez
    également forcer cette mise à jour directement via le bouton rafraichir.
  </p>

  <v-btn
    class="text-none mb-4 mr-3"
    color="deep-purple-darken-3"
    variant="flat"
    @click="toggleSimulationMode"
    prepend-icon="mdi-chart-box-outline"
  >
    Passer en mode simulation
  </v-btn>

  <v-btn
    :disabled="refresh"
    :loading="refresh"
    class="text-none mb-4"
    prepend-icon="mdi-refresh"
    color="deep-purple-lighten-4"
    @click="refreshData"
    variant="flat"
  >
    Rafraichir les données
  </v-btn>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data: () => ({
    loading: false,
    refresh: false,
  }),

  computed: {
    ...mapGetters(['getSimulationMode']),
    simulationMode() {
      return this.getSimulationMode;
    }
  },

  methods: {
    ...mapMutations(['setSimulationMode']),
    toggleSimulationMode() {
      const newMode = this.simulationMode === true ? false : true;
      this.setSimulationMode(newMode);
    },
    refreshData() {
      // Vos actions pour rafraîchir les données ici
    },
  },
};
</script>

<style>
</style>
