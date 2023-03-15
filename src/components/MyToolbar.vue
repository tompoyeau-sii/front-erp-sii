<template>
  <v-navigation-drawer
    style="background: linear-gradient(180deg,rgba(117, 81, 155, 1) 0%,rgba(232, 70, 84, 1) 100%);"
  >
    <v-img aspect-ratio class="sii" load src="../assets/SIIlogo.svg"></v-img>
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
    </v-list>
    <template v-slot:append>
      <router-link to="/">
        <v-list-item
          prepend-icon="mdi-logout"
          title="Se déconnecter"
          value="logout"
        ></v-list-item>
      </router-link>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "myToolbar",
};
</script>

<style scoped>
a {
  color: white;
}

.sii {
  width: 12vh;
  display: block;
  align-content: center;
  align-self: center;
}
</style>
