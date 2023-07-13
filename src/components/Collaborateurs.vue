<template>
  <div class="container">
    <v-row class="p-3">
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
                  src="../assets/img/collab/generic.png"
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
              v-if="posteEnCours(associate.id).map((job) => job) != ''"
              v-text="
                posteEnCours(associate.id)
                  .map((job) => job)
                  .join(', ')
              "
            ></td>
            <td
              class="mt-auto mb-auto"
              v-else
              v-text="'Pas encore de poste'"
            ></td>
            <!-- Affichage du nom prenom du manager -->
            <td 
            class="mt-auto mb-auto" 
            v-if="managerEnCours(associate.id).map((mission) => mission) != ''"
            v-text="managerEnCours(associate.id).map((mission) => mission).join(', ')">
          </td>

            <td
              class="mt-auto mb-auto text-blue"
              v-else-if="
                posteEnCours(associate.id).map((job) => job) == 'Manager'
              "
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-red"
              v-else
              v-text="'Intercontrat'"
            ></td>
            <!-- Affichage du nom de client -->
            <td
              class="mt-auto mb-auto"
              v-if="clientEnCours(associate.id).map((mission) => mission) != ''"
              v-text="
                clientEnCours(associate.id)
                  .map((mission) => mission)
                  .join(', ')
              "
            ></td>
             <td
              class="mt-auto mb-auto text-blue"
              v-else-if="
                posteEnCours(associate.id).map((job) => job) == 'Manager'
              "
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-red"
              v-else
              v-text="'Intercontrat'"
            ></td>
            <!-- Affichage du nom de projet -->
            <td
              v-if="projetEnCours(associate.id) != ''"
              v-text="
                projetEnCours(associate.id)
                  .map((project) => project)
                  .join(', ')
              "
            ></td>
             <td
              class="mt-auto mb-auto text-blue"
              v-else-if="
                posteEnCours(associate.id).map((job) => job) == 'Manager'
              "
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-red"
              v-else
              v-text="'Intercontrat'"
            ></td>
            <td>
              <router-link
                :to="{
                  name: 'FicheCollabView',
                  params: { id: associate.id },
                }"
              >
                <v-icon start icon="mdi-open-in-new"></v-icon>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="fetchData"
      ></v-pagination>
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
import { format } from "date-fns";
export default {
  name: "Collaborateur",
  components: {
    AddCollabForm,
  },
  data() {
    return {
      associates: [],
      error: "",
      SuccessState: false,
      snackbar: false,
      missions: [],
      currentPage: 1,
      totalPages: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    currentPage(newPage) {
      this.fetchData(newPage);
    },
  },
  methods: {
    async fetchData(page) {
      const response = await Axios.get(
        `/associates?page=${page || this.currentPage}`
      );
      this.associates = response.data.associate;
      this.totalPages = response.data.totalPages;
    },

    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    projetEnCours(associate_id) {
      var missionOfCollab = [];
      this.associates.forEach((associate) => {
        if (associate.id == associate_id) {
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date <= this.todayDate() &&
              mission.end_date >= this.todayDate() &&
              mission.associate_id == associate_id
            ) {
              missionOfCollab.push(mission.Project.label);
            }
          });
        }
      });
      return missionOfCollab;
    },
    clientEnCours(associate_id) {
      var missionOfCollab = [];
      this.associates.forEach((associate) => {
        if (associate.id == associate_id) {
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date <= this.todayDate() &&
              mission.end_date >= this.todayDate() &&
              mission.associate_id == associate_id
            ) {
              missionOfCollab.push(mission.Project.Customer.label);
            }
          });
        }
      });
      return missionOfCollab;
    },
    managerEnCours(associate_id) {
      var missionOfCollab = [];
      this.associates.forEach((associate) => {
        if (associate.id == associate_id) {
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date <= this.todayDate() &&
              mission.end_date >= this.todayDate() &&
              mission.associate_id == associate_id
            ) {
              missionOfCollab.push(
                mission.Project.Associate.first_name +
                  " " +
                  mission.Project.Associate.name
              );
            }
          });
        }
      });
      return missionOfCollab;
    },
    posteEnCours(associate_id) {
      var missionOfCollab = [];
      this.associates.forEach((associate) => {
        if (associate.id == associate_id) {
          associate.Jobs.forEach((job) => {
            if (
              job.Associate_Job.start_date <= this.todayDate() &&
              job.Associate_Job.end_date >= this.todayDate() &&
              job.Associate_Job.associate_id == associate_id
            ) {
              missionOfCollab.push(job.label);
            }
          });
        }
      });
      return missionOfCollab;
    },
    refresh() {
      this.associates = [];
      Axios.get("/associates").then((res) => {
        this.associates = res.data?.associate;
      });
    },
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
