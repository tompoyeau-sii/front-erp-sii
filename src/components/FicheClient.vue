<template>
  <div class="container" v-if="!isEditMode">
    <router-link class="retour mt-5" to="/clients">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>

    <v-row class="mt-2">
      <h5 class="title mt-5">{{ $route.params.client.label }}</h5>
    </v-row>
    <v-row justify="end">
      <v-btn
        @click.prevent="isEditMode = true"
        append-icon="mdi-pencil"
        color="deep-purple-lighten-4"
        class="m-2"
      >
        Modifier
      </v-btn>
      <v-dialog v-model="SupprDialog" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn
            append-icon="mdi-delete"
            v-bind="props"
            color="deep-purple-darken-3"
            class="m-2"
          >
            Supprimer
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            Suppression de {{ $route.params.client.label }}
          </v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer
            {{ $route.params.client.label }} ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              prepend-icon="mdi-close"
              @click="SupprDialog = false"
            >
              Annuler
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              prepend-icon="mdi-delete"
              @click="SupprDialog = false"
            >
              Confirmer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-col cols="2">
        <h5 class="pt-3 title">Manager</h5>
      </v-col>
    </v-row>
    <!-- Affichage du/des manager du client -->
    <div class="row">
      <div v-if="projects.length === 0">Pas de manager</div>
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
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                style="width: 100%"
                alt="John"
              ></v-img>
            </v-avatar>
          </div>
          <div class="col-2">
            <p
              class=""
              v-text="
                project.Associate.first_name + ' ' + project.Associate.name
              "
            ></p>
          </div>
        </div>
      </router-link>
    </div>
    <h5 class="pt-3 title" v-if="projects.length !== 0">Projets</h5>
    <AddProjectForm />

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
      <v-row justify="center">
        <AddMissionForm />
      </v-row>
    </div>
  </div>

  <div class="container" v-if="isEditMode">
    <v-form>
      <v-text-field
        v-model="firstName"
        :rules="rules"
        label="First name"
      ></v-text-field>
    </v-form>
    <v-btn
      append-icon="mdi-content-save"
      @click.prevent="isEditMode = false"
      color="deep-purple-darken-3"
      class="m-2"
    >
      Enregister
    </v-btn>
    <v-btn
      append-icon="mdi-close"
      @click.prevent="isEditMode = false"
      color="deep-purple-darken-3"
      class="m-2"
    >
      Annuler
    </v-btn>
  </div>
</template>

<script>
import AddProjectForm from "@/components/forms/AddProjectForm.vue";
import AddMissionForm from "@/components/forms/AddMissionForm.vue";
import Axios from "@/_services/caller.service";
export default {
  name: "FicheClient",
  components: {
    AddMissionForm,
    AddProjectForm,
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
      SuccessState: false,
      SuccessState: false,
    };
  },
  created() {
    this.projects = this.$route.params.client.Projects;

    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });

    Axios.get("/associates/managers").then((res) => {
      this.managers = res.data?.associate;
    });
  },
  methods: {
    formAddProject: function () {
      if (
        this.form.label !== "" &&
        this.form.customer !== "" &&
        this.form.manager !== ""
      ) {
        Axios.post("/project", {
          label: this.form.label,
          customer_id: this.form.customer,
          manager_id: this.form.manager,
        }).then(
          (response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Nouveau projet créé";
            this.error = "";
          },
          (response) => {
            this.SuccessState = false;
            console.log(response);
            this.error = response.data;
            console.log("erreur : " + this.error);
          }
        );
      } else {
        this.error = "Veuillez remplir tous les champs.";
      }
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