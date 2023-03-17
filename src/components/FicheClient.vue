<template>
  <div class="container">
    <router-link to="/clients">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>
    <h5 class="w-auto title">{{ $route.params.client.label }}</h5>
    <h5 class="pt-3 title">Projets</h5>
    <div class="row">
        <div class="table-responsive p-3 col-6" v-for="project in projects" :key="project.id">
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
                    <p class="mt-auto mb-auto ml-2" v-text="associate.Associate.first_name +' ' +associate.Associate.name"></p>
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