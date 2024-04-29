<template>
  <v-container>
    <v-row class="p-3">
      <v-col lg="6">
        <h1 class="title d-inline-block">Plan de charge</h1>
      </v-col>
      <v-row justify="end">
        <v-col lg="6"> </v-col>
      </v-row>
    </v-row>
    <div>
      <v-row class="m-1">
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
            item-title="label"
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
            @click="research"
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
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-file-excel-outline"
            color="deep-purple-lighten-4"
            @click="exportToExcel()"
          >
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="end" class="m-1">
        <v-col>
          <v-btn class="mr-2" color="deep-purple-darken-3"> En mission </v-btn>
          <v-btn class="mr-2" color="deep-purple-lighten-4 ">
            Intercontrat
          </v-btn>
          <v-btn class="mr-2" color="grey-lighten-1 "> Hors SII </v-btn>
        </v-col>
        <v-btn-toggle
          v-model="type"
          color="deep-purple-darken-3"
          mandatory
          shaped
        >
          <v-btn value="Mois"> Mois </v-btn>
          <v-btn value="Semaine"> Semaine </v-btn>
        </v-btn-toggle>
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
                <router-link
                  :to="{
                    name: 'FicheCollabView',
                    params: { id: associate.id },
                  }"
                >
                  <p>
                    {{ associate.full_name }}
                  </p>
                </router-link>
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
                  <v-btn color="deep-purple-darken-3" v-if="week.state == 1">{{
                    week.nb_day
                  }}</v-btn>
                  <v-btn
                    color="deep-purple-lighten-4"
                    v-else-if="week.state == 2"
                    >{{ week.nb_day }}</v-btn
                  >
                  <v-btn color="grey-lighten-1" v-else-if="week.state == 3">{{
                    week.nb_day
                  }}</v-btn>
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
import * as XLSX from "xlsx"; // Importez la bibliothèque XLSX de cette manière

export default {
  name: "Pdc",
  data() {
    return {
      value: "",
      filtered: false,
      type: "Mois",
      researchCollab: null,
      currentPage: 1,
      totalPages: 0,
      globalPage: 0,
      loading: true,
      selectedYear: null,
      years: [
        { label: "2021 - 2022", value: 2021 },
        { label: "2022 - 2023", value: 2022 },
        { label: "2023 - 2024", value: 2023 },
        { label: "2024 - 2025", value: 2024 },
        { label: "2025 - 2026", value: 2025 },
        { label: "2026 - 2027", value: 2026 },
      ],
      selectedManager: null,
      selectedCustomer: null,
      selectedProject: null,
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
      Axios.get("pdc/months", {
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
      if (this.type == "Mois") {
        Axios.get("pdc/months", {
          params: {
            year: this.selectedYear,
            search: this.researchCollab,
            manager: this.selectedManager,
            customer: this.selectedCustomer,
            project: this.selectedProject,
          },
        }).then((res) => {
          this.pdc = res.data?.pdc;
          console.log(this.pdc)
          this.outWeeks = res.data?.outWeeks;
          this.loading = false;
        });
      } else {
        Axios.get("pdc/weeks", {
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
      }
    },
    jsonToSheet() {
      const pdcData = this.pdc; // Récupérer les données PDC
      const sheet = {}; // Initialiser la feuille Excel

      // Boucler sur les données PDC
      pdcData.forEach((collaborator) => {
        const collaboratorName = collaborator.full_name; // Nom du collaborateur
        const weeksData = collaborator.weeks; // Données des semaines pour le collaborateur

        // Ajouter les données du collaborateur à la feuille Excel
        weeksData.forEach((week) => {
          const weekNumber = week.weekNumber; // Numéro de la semaine
          const state = week.state; // État de la semaine

          // Si la semaine n'existe pas encore dans la feuille Excel, l'ajouter
          if (!sheet[weekNumber]) {
            sheet[weekNumber] = {};
          }

          // Ajouter l'état du collaborateur pour cette semaine
          sheet[weekNumber][collaboratorName] = state;
        });
      });

      return sheet;
    },

    exportToExcel() {
      const sheetData = this.jsonToSheet(); // Convertir les données PDC en format Excel
      const sheetArray = this.createSheetArray(sheetData); // Convertir la feuille de données en format compatible XLSX
      const sheet = XLSX.utils.aoa_to_sheet(sheetArray); // Convertir la feuille de données en format compatible XLSX

      // Appliquer les styles de couleur en parcourant les données
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c + 1; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell = sheet[XLSX.utils.encode_cell(cell_address)];
          if (cell && (cell.v === 1 || cell.v === 2)) {
            const color = cell.v === 1 ? "4527a0" : "d1c4e9";
            cell.s = { fill: { fgColor: { rgb: color } } };
          }
        }
      }

      const workbook = XLSX.utils.book_new(); // Créer un nouveau classeur
      XLSX.utils.book_append_sheet(workbook, sheet, "Plan de charge"); // Ajouter la feuille de données au classeur
      XLSX.writeFile(workbook, "pdc.xlsx"); // Télécharger le fichier Excel
    },
    createSheetArray(sheetData) {
      const sheetArray = [];

      // Ajouter les noms des collaborateurs comme en-tête de colonne
      const headerRow = Object.keys(sheetData).reduce((acc, weekNumber) => {
        acc.push(weekNumber);
        return acc;
      }, []);
      sheetArray.push(["", ...headerRow]); // Première colonne vide pour les noms des collaborateurs

      // Ajouter les données des collaborateurs pour chaque semaine
      const collaboratorNames = Object.keys(
        sheetData[Object.keys(sheetData)[0]]
      );
      collaboratorNames.forEach((collaboratorName) => {
        const row = [collaboratorName];
        Object.keys(sheetData).forEach((weekNumber) => {
          const state = sheetData[weekNumber][collaboratorName] || "";
          row.push(state);
        });
        sheetArray.push(row);
      });

      return sheetArray;
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
        this.filterAssociates();
      });

    Axios.get("/associates").then((res) => {
      res.data?.associate.forEach((associate) => {
        associate.full_name = associate.first_name + " " + associate.name;
        this.associates.push(associate);
      });
    });
  },

  watch: {
    type() {
      this.filterAssociates();
    },
  },

  computed: {
    managers() {
      return this.$store.getters.getManagers;
    },
  },
};
</script>

<style scoped>

a {
  color: black;
}
p {
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
}
</style>