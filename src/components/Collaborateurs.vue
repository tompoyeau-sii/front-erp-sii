<template>
  <div class="container">
    <v-row class="mt-3">
      <v-col lg="6">
        <h1 class="title">Collaborateurs SII Le Mans</h1>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <AddCollabForm />
        </v-col>
      </v-row>
    </v-row>
    <div class="table-responsive p-3">
      <table class="table rounded-3 shadow bg-white table-striped">
        <thead>
          <tr style="border: white">
            <th>Collaborateur</th>
            <th>Poste</th>
            <th>Manager</th>
            <th>Client</th>
            <th>Projet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="associate in associates" :key="associate.id">
            <td style="display: flex; align-content: center">
              <v-avatar>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>

              <p
                class="mt-auto mb-auto ml-2"
                v-text="associate.first_name + ' ' + associate.name"
              ></p>
            </td>
            <td
              class="mt-auto mb-auto"
              v-if="associate.Jobs.map((job) => job.label) != ''"
              v-text="associate.Jobs.map((job) => job.label).join(', ')"
            ></td>
            <td
              class="mt-auto mb-auto"
              v-else
              v-text="'Pas encore de poste'"
            ></td>
            <td
              class="mt-auto mb-auto"
              v-if="
                associate.Missions.map(
                  (mission) => mission.Project.Associate.first_name
                ) != ''
              "
              v-text="
                associate.Missions.map(
                  (mission) =>
                    mission.Project.Associate.first_name +
                    ' ' +
                    mission.Project.Associate.name
                ).join(', ')
              "
            ></td>
            <td class="mt-auto mb-auto text-red" v-else v-text="'Intercontrat'"></td>
            <!-- Affichage du nom de client -->
            <td
              class="mt-auto mb-auto"
              v-if="
                associate.Missions.map(
                  (mission) => mission.Project.Customer.label
                ) != ''"
              v-text="
                associate.Missions.map(
                  (mission) => mission.Project.Customer.label
                ).join(', ')
              "
            ></td>
            <td class="mt-auto mb-auto text-red" v-else v-text="'Intercontrat'"></td>
            <!-- Affichage du nom de projet -->
            <td
            v-if="associate.Missions.map((project) => project.Project.label) != ''"
              v-text="
                associate.Missions.map((project) => project.Project.label).join(
                  ', '
                )
              "
            ></td>
            <td class="mt-auto mb-auto text-red"  v-else v-text="'Intercontrat'"></td>
            <td>
              <router-link
                :to="{ name: 'FicheCollabView', params: { id: associate.id } }"
              >
                <v-icon start icon="mdi-open-in-new"></v-icon>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-snackbar
      v-if="SuccessState == true"
      v-model="snackbar"
      w-auto
      color="green"
      timeout="3000"
    >
      <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
      {{ success }}
    </v-snackbar>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddCollabForm from "@/components/forms/AddCollabForm.vue";
export default {
  name: "Collaborateur",
  components: {
    AddCollabForm,
  },
  data() {
    return {
      form: {
        name: "",
        first_name: "",
        sexe: "",
        graduation: "",
        birthdate: "",
        job: "",
        mail: this.first_name + "." + this.name + "@sii.fr",
        start_date: "",
        pru: "",
        isManager: null,
        isTutor: null,
      },
      dialog: false,
      success: "",
      associates: [],
      jobs: [],
      graduations: [],
      error: "",
      items: [],
      model: null,
      SuccessState: true,
      snackbar: false,
    };
  },
  methods: {
    refresh() {
      this.associates = [];
      Axios.get("/associates").then((res) => {
        this.associates = res.data?.associate;
      });
    },

    formAddCollab: function () {
      if (
        this.form.first_name != "" &&
        this.form.name != "" &&
        this.form.sexe != "" &&
        this.form.graduation != "" &&
        this.form.job != "" &&
        this.form.birthdate != "" &&
        this.form.mail != "" &&
        this.form.start_date != "" &&
        this.form.pru != ""
      ) {
        Axios.post("/associate", {
          name: this.form.name,
          first_name: this.form.first_name,
          gender: this.form.sexe,
          graduation_id: this.form.graduation,
          job_id: this.form.job,
          birthdate: this.form.birthdate,
          start_date: this.form.start_date,
          mail: this.form.mail,
          pru: this.form.pru,
          isTutor: this.form.isTutor,
          isManager: this.form.isManager,
        })
          .then((response) => {
            console.log(response);
            this.dialog = false;
            this.SuccessState = true;
            this.error = "";
            this.success = "Nouveau collaborateurs ajouté.";
            this.refresh();
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        this.error = "Tous les champs sont obligatoires.";
      }
    },
  },
  created() {
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
    });
    Axios.get("/jobs").then((res) => {
      this.jobs = res.data?.job;
    });
    Axios.get("/graduations").then((res) => {
      this.graduations = res.data?.graduation;
    });
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
  border-style: none;
}

.v-card {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>
