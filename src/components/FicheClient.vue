<template>
  <v-container>
    <v-row>
      <v-col class="mt-2">
        <v-btn
          size="small"
          variant="text"
          @click="retourPagePrecedente"
          prepend-icon="mdi-arrow-left"
          >Retour</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col lg="6">
        <h5 class="title mt-5">{{ $route.params.client.label }}</h5>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <UpdateClientForm
            :customer_id="$route.params.client.id"
            :customer="$route.params.client.label"
          />
        </v-col>
      </v-row>
    </v-row>
<!-- 
    <v-row>
      <v-col v-if="projects.length != 0" lg="2" md="6" sm="6">
        <h5 class="pt-3 title">Manager</h5>
      </v-col>
    </v-row> -->
    <!-- Affichage du/des manager du client -->
    <!-- <div class="row">
      <router-link
        class="col-2 manager rounded-3 m-2 pt-3 shadow-sm"
        v-for="project in projects"
        :key="project.id"
        :to="{
          name: 'FicheCollabView',
          params: { id: project.Associate.id },
        }"
      >
        <div class="row">
          <div class="col-3">
            <v-avatar>
              <v-img
                src="../assets/img/collab/generic.png"
                style="width: 100%"
              ></v-img>
            </v-avatar>
          </div>
          <div class="col-2">
            <p
              v-text="
                project.Associate.first_name + ' ' + project.Associate.name
              "
            ></p>
          </div>
        </div>
      </router-link>
    </div> -->
    <v-row class="mt-3">
      <v-col lg="6">
        <h5 class="title" v-if="projects.length !== 0">Projets</h5>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <AddProjectForm :customer_id="$route.params.client.id" />
        </v-col>
      </v-row>
    </v-row>
    <!-- Affichage de la liste de projet avec chaque collab assigné -->
    <div class="row">
      <div
        class="table-responsive p-3 col-lg-6 col-md-12"
        v-for="project in projects"
        :key="project.id"
      >
        <table class="table rounded-3 shadow bg-white">
          <v-row justify="center" class="m-2">
            <h5 class="title" v-text="project.label"></h5>
          </v-row>
          <tbody>
            <v-row> </v-row>
            <tr v-for="mission in project.Missions" :key="mission.id">
              <td
                v-if="
                  mission.date_range_mission[0].value < todayDate() &&
                  mission.date_range_mission[1].value > todayDate()
                "
                style="display: flex; align-content: center"
              >
                <v-avatar>
                  <v-img
                    src="../assets/img/collab/generic.png"
                    alt="John"
                  ></v-img>
                </v-avatar>
                <p
                  class="mt-auto mb-auto ml-2"
                  v-text="
                    mission.Associate.first_name +
                    ' ' +
                    mission.Associate.name
                  "
                ></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <v-row v-if="projects.length !== 0" justify="center">
        <AddMissionForm :customer_id="$route.params.client.id" />
      </v-row>
    </div>
  </v-container>
</template>

<script>
import AddProjectForm from "@/components/forms/add/AddProjectForm.vue";
import AddMissionForm from "@/components/forms/add/AddMissionForm.vue";
import UpdateClientForm from "@/components/forms/update/UpdateClientForm.vue";
import { format } from "date-fns";
export default {
  name: "FicheClient",
  components: {
    AddMissionForm,
    AddProjectForm,
    UpdateClientForm,
  },
  data() {
    return {
      SupprDialog: false,
      managers: [],
      customers: [],
      dialog: false,
      isEditMode: false,
      projects: [],
      SuccessState: false,
      error: "",
    };
  },
  created() {
    this.projects = this.$route.params.client.Projects;
    console.log(this.projects);
  },
  methods: {
    retourPagePrecedente() {
      this.$router.go(-1);
    },
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
  },
};
</script>

<style scoped>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
.manager {
  background: linear-gradient(135deg, #0ff0b3 0%, #036ed9 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}
</style>