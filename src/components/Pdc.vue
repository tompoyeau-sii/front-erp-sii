<template>
  <v-container>
    <h1 class="title">Plan de charge</h1>
    <div>
      <v-row>
        <v-col cols="6" lg="2" md="2">
          <v-autocomplete
            v-model="researchCollab"
            variant="solo"
            label="Collaborateur"
            bg-color="deep-purple-darken-3"
            :items="associates"
            item-title="full_name"
            item-value="full_name"
          >
          </v-autocomplete>
        </v-col>

        <v-col cols="6" lg="2" md="2">
          <v-select
            label="Année"
            :items="years"
            item-title="label"
            item-value="value"
            variant="solo"
            bg-color="red-accent-2"
            v-model="selectedYear"
          ></v-select>
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
        <v-col cols="12" lg="2" md="2">
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-magnify"
            color="deep-purple-darken-3"
            class="mr-3"
            @click="research"
          >
          </v-btn>
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-close"
            color="deep-purple-lighten-4"
            @click="stopResearch()"
          >
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col>
          <v-btn class="mr-2" color="deep-purple-darken-3"> En mission </v-btn>
          <v-btn class="mr-2" color="deep-purple-lighten-4 ">
            Intercontrat
          </v-btn>
          <v-btn class="mr-2" color="grey-lighten-1 "> Hors SII </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="loading">
        <v-progress-circular indeterminate color="purple"></v-progress-circular>
      </v-row>
      <v-row v-else class="rounded shadow m-2">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in pdc" :key="associate">
              <td>
                <p>
                  {{ associate.full_name }}
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-table class="col-11">
          <thead>
            <tr>
              <th v-for="week in outWeeks" :key="week.weekNumber">
                <span
                  v-if="week.currentWeek"
                  class="bg-deep-purple-darken-3 p-1 rounded"
                >
                  {{ week.weekNumber }}
                </span>
                <span v-else>
                  {{ week.weekNumber }}
                </span>
              </th>
            </tr>
            <tr>
              <th v-for="week in outWeeks" :key="week.weekNumber">
                <div>
                  <span class="text-deep-purple-darken-3">
                    {{ week.nbInMission }}
                  </span>
                  /
                  <span class="text-deep-purple-lighten-4">
                    {{ week.nbInterContrat }}</span
                  >
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="associate in pdc" :key="associate.full_name">
              <td id="facture" v-for="week in associate.weeks" :key="week">
                <div style="display: flex">
                  <v-btn
                    color="deep-purple-darken-3"
                    v-if="week.state == 1"
                  ></v-btn>
                  <v-btn
                    color="deep-purple-lighten-4"
                    v-else-if="week.state == 2"
                  ></v-btn>
                  <v-btn
                    color="grey-lighten-1"
                    v-else-if="week.state == 3"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-row>
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "Pdc",
  data() {
    return {
      value: "",
      filtered: false,
      researchCollab: null,
      currentPage: 1,
      totalPages: 0,
      globalPage: 0,
      loading: true,
      selectedYear: null,
      years: [
        { label: "2021 - 2022", value: 2021 },
        { label: "2022 - 2023", valeur: 2022 },
        { label: "2023 - 2024", valeur: 2023},
        { label: "2024 - 2025", valeur: 2024 },
        { label: "2025 - 2026", valeur: 2025 },
        { label: "2026 - 2027", valeur: 2026 },
      ],
      selectedManager: null,
      selectedCustomer: null,
      selectedProject: null,
      pdcCalculated: [],
      associates: [],
    };
  },

  methods: {
    research() {
      this.filterAssociates();
    },
    // Arrete la recherche et remet le plan de charge à l'original
    stopResearch() {
      this.loading = true;
      this.selectedCustomer = null;
      this.selectedProject = null;
      this.selectedManager = null;
      this.researchCollab = null;
      Axios.get("pdc", {
        params: {
          year: this.selectedYear,
        },
      }).then((res) => {
        this.pdc = res.data?.pdc;
        this.loading = false;
      });
    },
    filterAssociates() {
      this.loading = true;
      Axios.get("pdc", {
        params: {
          year: this.selectedYear,
          search: this.researchCollab,
          manager: this.selectedManager,
          customer: this.selectedCustomer,
          project: this.selectedProject,
        },
      }).then((res) => {
        this.pdc = res.data?.pdc;
        this.outWeeks = res.data?.outWeeks;
        this.loading = false;
      });
    },
  },
  created() {
    this.loading = true;

    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });

    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
      if (this.customer_id) {
        this.projects.forEach((project) => {
          if (project.customer_id == this.customer_id) {
            // Ajoute le projet correspondant à l'ID spécifié au tableau filtré
            project.label_adv = project.label + " - " + project.adv;
            this.projectsFiletred.push(project);
          }
        });
      }
    });

    Axios.get("/pdc/year")
      .then((res) => {
        this.selectedYear = res.data?.pdc.actual_year;
      })
      .then((year) => {
        Axios.get("pdc", {
          params: {
            year: this.selectedYear,
          },
        }).then((res) => {
          this.pdc = res.data?.pdc;
          this.outWeeks = res.data?.outWeeks;
          // this.pdcCalculated = this.uniqueAssociates();
          this.loading = false;
          // console.log(this.pdcCalculated);
        });
      });

    Axios.get("/associates").then((res) => {
      res.data?.associate.forEach((associate) => {
        associate.full_name = associate.first_name + " " + associate.name;
        this.associates.push(associate);
      });
    });
  },

  computed: {
    managers() {
      return this.$store.getters.getManagers;
    },
  },
};
</script>

<style scoped>
p {
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
}
</style>