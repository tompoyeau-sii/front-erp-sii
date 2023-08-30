<template>
  <v-container>
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
    <v-row class="ml-1">
      <v-col cols="12" lg="4" md="4">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          label="Collaborateur"
          bg-color="deep-purple-darken-3"
          v-model="search"
          variant="solo"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6" lg="2" md="2">
        <v-select
          v-model="selectedManager"
          bg-color="red-accent-2"
          :items="managers"
          clearable
          item-title="full_name"
          item-value="full_name"
          label="Manager"
          variant="solo"
        ></v-select>
      </v-col>
      <v-col cols="6" lg="2" md="2">
        <v-select
          v-model="selectedCustomer"
          variant="solo"
          clearable
          label="Client"
          bg-color="red-accent-2"
          :items="customers"
          item-title="label"
          item-value="label"
        ></v-select>
      </v-col>
      <v-col cols="6" lg="2" md="2">
        <v-select
          v-model="selectedProject"
          variant="solo"
          label="Projet"
          clearable
          bg-color="red-accent-2"
          :items="projects"
          item-title="label"
          item-value="label"
        ></v-select>
      </v-col>
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
          <tr v-for="associate in filteredAssociates" :key="associate.id">
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
              v-if="associate.Jobs.map((job) => job) != ''"
              v-text="associate.Jobs.map((job) => job.label).join(', ')"
            ></td>
            <td
              class="mt-auto mb-auto text-grey"
              v-else-if="associate.start_date >= todayDate()"
              v-text="'Pas encore embauché'"
            ></td>
            <td
              class="mt-auto mb-auto"
              v-else
              v-text="'Pas encore de poste'"
            ></td>
            <!-- Affichage du nom prenom du manager -->
            <td
              class="mt-auto mb-auto"
              v-if="associate.managers.map((manager) => manager) != ''"
              v-text="
                associate.managers
                  .map((manager) => manager.first_name + ' ' + manager.name)
                  .join(', ')
              "
            ></td>

            <td
              class="mt-auto mb-auto text-blue"
              v-else-if="associate.Jobs.map((job) => job.label) == 'Manager'"
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-grey"
              v-else-if="associate.start_date >= todayDate()"
              v-text="'Pas encore embauché'"
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
              v-else-if="associate.Jobs.map((job) => job.label) == 'Manager'"
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-grey"
              v-else-if="associate.start_date >= todayDate()"
              v-text="'Pas encore embauché'"
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
              v-else-if="associate.Jobs.map((job) => job.label) == 'Manager'"
              v-text="'Manager'"
            ></td>
            <td
              class="mt-auto mb-auto text-grey"
              v-else-if="associate.start_date >= todayDate()"
              v-text="'Pas encore embauché'"
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
  </v-container>
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
      calculatedAssociates: [],
      filteredAssociates: [],
      allAssociates: [],
      error: "",
      SuccessState: false,
      snackbar: false,
      missions: [],
      currentPage: 1,
      globalPages: 0,
      totalPages: 0,
      search: null,
      managers: [],
      customers: [],
      projects: [],
      selectedManager: null,
      selectedCustomer: null,
      selectedProject: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  created() {
    Axios.get("/associates/all").then((res) => {
      this.allAssociates = res.data?.associate;
      this.calculateAssociate();
    });
    Axios.get("/associates/managers").then((res) => {
      //this.managers = res.data?.associate;
      res.data?.associate.forEach((job) => {
        job.Associates.forEach((manager) => {
          if (
            manager.Associate_Job.start_date < this.todayDate() &&
            manager.Associate_Job.end_date > this.todayDate()
          ) {
            manager.full_name = manager.first_name + " " + manager.name;
            this.managers.push(manager);
          }
        });
      });
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
  },
  watch: {
    currentPage(newPage) {
      this.fetchData(newPage);
    },
    search() {
      this.filterAssociates();
    },
    selectedManager() {
      this.filterAssociates();
    },
    selectedCustomer() {
      this.filterAssociates();
    },
    selectedProject() {
      this.filterAssociates();
    },
  },

  methods: {
    async fetchData(page) {
      const response = await Axios.get(
        `/associates?page=${page || this.currentPage}`
      );
      this.associates = response.data.associate;
      console.log(this.associates);
      this.totalPages = response.data.totalPages;
      this.globalPages = response.data.totalPages;
      this.filterAssociates();
    },
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    calculateAssociate() {
      this.allAssociates.forEach((associate) => {
        const calculatedAssociate = {
          id: associate.id,
          first_name: associate.first_name,
          name: associate.name,
          project: this.projetEnCours(associate.id),
          customer: this.clientEnCours(associate.id),
          managers: associate.managers.map((job) => job.full_name),
          jobs: this.posteEnCours(associate.id),
        };
        this.calculatedAssociates.push(calculatedAssociate);
      });
      console.log(this.calculatedAssociates);
    },
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    projetEnCours(associate_id) {
      var missionOfCollab = [];
      this.allAssociates.forEach((associate) => {
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
      this.allAssociates.forEach((associate) => {
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
    posteEnCours(associate_id) {
      var missionOfCollab = [];
      this.allAssociates.forEach((associate) => {
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
    filterAssociates() {
      this.filteredAssociates = this.associates;
      this.totalPages = this.globalPages;
      if (this.search) {
        const searchTerm = this.search.toLowerCase();
        this.totalPages = 1;
        this.filteredAssociates = this.allAssociates.filter((associate) => {
          const fullName = associate.first_name + " " + associate.name;
          return fullName.toLowerCase().includes(searchTerm);
        });
        this.totalPages = Math.ceil(this.filteredAssociates.length / 10);
      }

      if (this.selectedManager) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.manager.some(
              (manager) => manager === this.selectedManager
            )
        );
        this.totalPages = Math.ceil(this.filterAssociates.length / 10);
      }

      if (this.selectedCustomer) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.customer.some(
              (customer) => customer === this.selectedCustomer
            )
        );
        this.totalPages = Math.ceil(this.filterAssociates.length / 10);
      }

      if (this.selectedProject) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.project.some(
              (project) => project === this.selectedProject
            )
        );
        this.totalPages = Math.ceil(this.filterAssociates.length / 10);
      }
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
