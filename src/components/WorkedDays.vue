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
    <h1 class="title d-inline-block">Gestion des jours de présence</h1>
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
        <v-autocomplete
          v-model="selectedManager"
          bg-color="red-accent-2"
          :items="managers"
          clearable
          item-title="full_name"
          item-value="full_name"
          label="Manager"
          variant="solo"
        ></v-autocomplete>
      </v-col>
      <v-col cols="6" lg="2" md="2">
        <v-autocomplete
          v-model="selectedCustomer"
          variant="solo"
          clearable
          label="Client"
          bg-color="red-accent-2"
          :items="customers"
          item-title="label"
          item-value="label"
        ></v-autocomplete>
      </v-col>
      <v-col cols="6" lg="2" md="2">
        <v-autocomplete
          v-model="selectedProject"
          variant="solo"
          label="Projet"
          clearable
          bg-color="red-accent-2"
          :items="projects"
          item-title="label_adv"
          item-value="label"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" lg="2" md="2">
        <v-btn
          size="large"
          rounded="2"
          icon="mdi-magnify"
          color="deep-purple-darken-3"
          class="mr-3"
          @click="filtredAssociates"
        >
        </v-btn>
        <v-btn
          size="large"
          rounded="2"
          icon="mdi-close"
          class="mr-3"
          color="deep-purple-lighten-4"
          @click="stopResearch()"
        >
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex flex-row">
      <v-tabs v-model="selectedMonthIndex" color="primary" direction="vertical">
        <v-tab v-for="(month, index) in filteredMonths" :key="index">
          {{ month.month }}
        </v-tab>
      </v-tabs>
      <v-window class="w-50" v-model="selectedMonthIndex">
        <v-window-item
          v-for="(month, index) in filteredMonths"
          :key="index"
          :value="index"
        >
          <v-card>
            <v-card-text>
              <div class="p-3 table-responsive">
                <table class="table rounded-3 shadow bg-white table-striped">
                  <thead>
                    <tr style="border: white">
                      <th>Collaborateur</th>
                      <th>Nombre de jours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="associate in associatesData" :key="associate">
                      <td>
                        <p class="mt-auto mb-auto ml-2">
                          {{ associate.full_name }}
                        </p>
                      </td>
                      <td class="mt-auto mb-auto">
                        <v-text-field
                          v-if="associate.nb_day == null"
                          type="number"
                          variant="solo"
                          placeholder="18"
                          v-model="associateDays[associate.id]"
                          @change="handleNbDayCreate(associate.id, associateDays[associate.id])"
                        >
                        </v-text-field>
                        <v-text-field
                          type="number"
                          variant="solo"
                          v-else
                          v-model="associate.nb_day"
                          @change="handleNbDayUpdate(associate.id, associate.nb_day)"
                        >
                        </v-text-field>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { isAfter, parseISO } from "date-fns";
export default {
  name: "WorkedDays",
  data() {
    return {
      months: [],
      associates: [],
      associatesData: [],
      associateDays: {},
      currentDate: new Date(),
      selectedMonthIndex: null,
      customers: [],
      projects: [],
      projectsFiletred: [],
      years: [
        { label: "2021 - 2022", value: 2021 },
        { label: "2022 - 2023", value: 2022 },
        { label: "2023 - 2024", value: 2023 },
        { label: "2024 - 2025", value: 2024 },
        { label: "2025 - 2026", value: 2025 },
        { label: "2026 - 2027", value: 2026 },
      ],
      researchCollab: null,
      selectedYear: null,
      selectedManager: null,
      selectedCustomer: null,
      selectedProject: null,
    };
  },

  created() {
    Axios.get("workeddays/associates").then((res) => {
      this.associatesData = res.data?.associate;
    });

    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });

    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
      this.projects.forEach((project) => {
        // Ajoute le projet correspondant à l'ID spécifié au tableau filtré
        project.label_adv = project.label + " - " + project.adv;
        this.projects.push(project);
      });
    });

    Axios.get("/associates").then((res) => {
      res.data?.associate.forEach((associate) => {
        associate.full_name = associate.first_name + " " + associate.name;
        this.associates.push(associate);
      });
    });

    Axios.get("pdc/year").then((res) => {
      this.selectedYear = res.data?.pdc.actual_year;

      this.months = [
        { month: "Mars", date: `${this.selectedYear + 1}-03-01` },
        { month: "Février", date: `${this.selectedYear + 1}-02-01` },
        { month: "Janvier", date: `${this.selectedYear + 1}-01-01` },
        { month: "Décembre", date: `${this.selectedYear}-12-01` },
        { month: "Novembre", date: `${this.selectedYear}-11-01` },
        { month: "Octobre", date: `${this.selectedYear}-10-01` },
        { month: "Septembre", date: `${this.selectedYear}-09-01` },
        { month: "Août", date: `${this.selectedYear}-08-01` },
        { month: "Juillet", date: `${this.selectedYear}-07-01` },
        { month: "Juin", date: `${this.selectedYear}-06-01` },
        { month: "Mai", date: `${this.selectedYear}-05-01` },
        { month: "Avril", date: `${this.selectedYear}-04-01` },
      ];

      
    });
  },
  computed: {
    managers() {
      return this.$store.getters.getManagers;
    },

    // Calculer les mois filtrés
    filteredMonths() {
      // Créer une liste des mois depuis avril de l'année précédente jusqu'au mois précédant le mois actuel
      const filteredMonths = [];
      this.months.forEach((month) => {
        if (isAfter(this.currentDate, parseISO(month.date))) {
        // if (isAfter(this.currentDate, parseISO(month.date))) {
          filteredMonths.push(month);
        }
      });
      return filteredMonths;
    },
  },
  methods: {
    retourPagePrecedente() {
      this.$router.go(-1);
    },

    stopResearch() {
      this.loading = true;
      this.selectedCustomer = null;
      this.selectedProject = null;
      this.selectedManager = null;
      this.researchCollab = null;
      this.filtredAssociates();
    },

    filtredAssociates() {
      let filteredAssociates = [];
      if (this.selectedMonthIndex === null) return filteredAssociates; // Si aucun mois sélectionné, retourne une liste vide

      const selectedMonth = this.filteredMonths[this.selectedMonthIndex];
      Axios.get("/workeddays/associates", {
        params: {
          month: selectedMonth.date,
          search: this.researchCollab,
          manager: this.selectedManager,
          customer: this.selectedCustomer,
          project: this.selectedProject,
        },
      }).then((associates) => {
        filteredAssociates = associates.data?.associate;
        this.associatesData = filteredAssociates;
      });
    },

    handleNbDayCreate(associate_id, associate_nb_day) {
      const selectedMonth = this.filteredMonths[this.selectedMonthIndex];
      Axios.post("/workeddays", {
          associate_id: associate_id,
          month_date: selectedMonth.date,
          nb_day: associate_nb_day,
      }).then((workeddaysUpdated) => {
        this.filtredAssociates();
      });
    },

    handleNbDayUpdate(associate_id, associate_nb_day) {
      const selectedMonth = this.filteredMonths[this.selectedMonthIndex];
      Axios.put("/workeddays/update", {
          associate_id: associate_id,
          month_date: selectedMonth.date,
          nb_day: associate_nb_day,
      }).then((workeddaysUpdated) => {
        this.filtredAssociates();
      });
    },
  },
  watch: {
    selectedMonthIndex() {
      this.associateDays = {};
      this.filtredAssociates();
    },
  },
};
</script>

<style scoped>
.v-card {
  background: none;
  color: black;
}
</style>
