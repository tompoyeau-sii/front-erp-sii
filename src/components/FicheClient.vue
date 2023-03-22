<template>
  <div class="container">
    <router-link class="retour mt-5" to="/clients">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>

    <h5 class="title mt-5">{{ $route.params.client.label }}</h5>
    <h5 class="pt-3 title">Manager</h5>
    <!-- Affichage du/des manager du client -->
    <div class="row">
      <div v-if="projects.length===0">
        Pas de manager
      </div>
      <div
        class="col-2 bg-white shadow m-3 rounded pt-3"
        v-for="project in projects"
        :key="project.id"
      >
        <div class="row">
          <div class="col">
            <v-avatar>
              <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              ></v-img>
            </v-avatar>
          </div>
            <p
              v-text="
                project.Associate.first_name + ' ' + project.Associate.name
              "
            ></p>
        </div>
      </div>
    </div>
    <h5 class="pt-3 title" v-if="projects.length !==0">Projets</h5>

    <!-- Affichage de la liste de projet avec chaque collab assigné -->
    <div class="row">
      <div
        class="table-responsive p-3 col-lg-6 col-md-12"
        v-for="project in projects"
        :key="project.id"
      >
        <table class="table rounded-3 shadow bg-white">
          <v-row justify="center" class="mt-3">
            <h5 class="title" v-text="project.label"></h5>
          </v-row>
          <tbody>
            <tr v-for="associate in project.Missions" :key="associate.id">
              <td style="display: flex; align-content: center">
                <v-avatar>
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  ></v-img>
                </v-avatar>
                <p
                  class="mt-auto mb-auto ml-2"
                  v-text="
                    associate.Associate.first_name +
                    ' ' +
                    associate.Associate.name
                  "
                ></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FicheClient",
  data() {
    return {
      projects: [],
    };
  },
  created() {
    this.projects = this.$route.params.client.Projects;
  },
};
</script>

<style scoped>
</style>