<template>
  <v-navigation-drawer
    v-if="isLog()"
    v-model="drawer"
    class="toolBar"
    style="background: linear-gradient(180deg,rgba(117, 81, 155, 1) 0%,rgba(232, 70, 84, 1) 100%) !important;">
    <!-- <v-img aspect-ratio class="sii" load src="../assets/SIIlogo.svg"></v-img> -->
    <v-img
      style="text-align: center"
      aspect-ratio
      class="sii"
      src="../assets/img/Piscou-logo-primaire@2x.png"
    ></v-img>
    <v-list nav>
      <router-link to="/dashboard">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Tableau de bord"
          value="dashboard"
        ></v-list-item>
      </router-link>

      <router-link to="/collaborateurs">
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Collaborateurs"
          value="collaborateurs"
        ></v-list-item>
      </router-link>

      <router-link to="/clients">
        <v-list-item
          prepend-icon="mdi-office-building"
          title="Clients"
          value="clients"
        ></v-list-item>
      </router-link>
      <router-link to="/pdc">
        <v-list-item
          prepend-icon="mdi-calendar-edit"
          title="Plan de charge"
          value="pdc"
        ></v-list-item>
      </router-link>
      <router-link to="/gestion-jours">
        <v-list-item
          prepend-icon="mdi-counter"
          title="Gestion présence"
          value="gestion-jours"
        ></v-list-item>
      </router-link>
      <router-link to="/statistiques">
        <v-list-item
          prepend-icon="mdi-chart-areaspline"
          title="Statistiques"
          value="Statistiques"
        ></v-list-item>
      </router-link>
      <router-link to="/parametres">
        <v-list-item
          prepend-icon="mdi-cog"
          title="Paramètres"
          value="parametres"
        ></v-list-item>
      </router-link>
      <!-- <router-link to="/simulation">
        <v-list-item
          prepend-icon="mdi-chart-timeline-variant-shimmer"
          title="Mode simulation"
          value="simulation"
        ></v-list-item>
      </router-link> -->
    </v-list>
    <template v-slot:append>
      <v-list-item>
        <v-btn
          v-if="simulationMode() == true"
          prepend-icon="mdi-alert"
          color="warning"
        >
          Mode simulation
        </v-btn>
      </v-list-item>
      <router-link to="/">
        <v-list-item
          v-on:click="disconnect"
          prepend-icon="mdi-logout"
          :title="userName"
          value="logout"
        ></v-list-item>
      </router-link>
    </template>
  </v-navigation-drawer>
  <v-app-bar v-if="!drawer" color="transparent" elevation="0">
    <v-app-bar-nav-icon
      color="deep-purple-darken-3"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { accountService } from "@/_services";
export default {
  name: "myToolbar",
  data() {
    return {
      drawer: null,
      userName: localStorage.getItem("userName")
    };
  },
  methods: {
    ...mapActions(["setSimulationMode"]),
    detectScreenSize() {
      var screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      // Vérifier si la largeur de l'écran est inférieure à 1280 pixels
      if (screenWidth < 1280) {
        // Modifier la variable "drawer" à false
        this.drawer = false;
      } else {
        // Modifier la variable "drawer" à true
        this.drawer = true;
      }
    },
    disconnect: function (event) {
      this.setSimulationMode(false);
      accountService.logout();
    },
    isLog: function () {
      return accountService.isLogged();
    },
    simulationMode() {
      if(this.getSimulationMode == "true" || localStorage.getItem("isSimulation") == "true") {
        return true;
      }
      return false;
    },
  },
  computed: {
    ...mapGetters(["getSimulationMode"]),

  },
};
</script>

<style scoped>
a {
  color: white;
}

.toolBar {
  background: linear-gradient(
    180deg,
    rgba(117, 81, 155, 1) 0%,
    rgba(232, 70, 84, 1) 100%
  ) !important;
}

.sii {
  width: 18vh;
  display: block;
  align-content: center;
  align-self: center;
  margin: auto;
  margin-top: 5vh;
  margin-bottom: 3vh;
}
</style>
