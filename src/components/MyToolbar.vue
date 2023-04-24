<template>
  <v-navigation-drawer
    v-if="isLog()"
    class="toolBar"
    style="background: linear-gradient(180deg,rgba(117, 81, 155, 1) 0%,rgba(232, 70, 84, 1) 100%) !important; text-align: center;">
    <!-- <v-img aspect-ratio class="sii" load src="../assets/SIIlogo.svg"></v-img> -->
    <v-img aspect-ratio class="sii" load src="../assets/img/picsou.png" v-once></v-img>
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
      <router-link to="/Statistiques">
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

    </v-list>
    <template v-slot:append>
      <router-link to="/">
        <v-list-item
          v-on:click="disconnect"
          prepend-icon="mdi-logout"
          title="Se déconnecter"
          value="logout"
        ></v-list-item>
      </router-link>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { accountService } from "@/_services";
export default {
  name: "myToolbar",
  methods: {
    disconnect: function (event) {
      accountService.logout()
    },
    isLog: function () {
      return accountService.isLogged()
    },
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
  width: 12vh;
  display: block;
  align-content: center;
  align-self: center;
  margin: auto;
}


</style>
