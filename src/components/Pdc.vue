<template>
  <v-container>
    <h1 class="title">Plan de charge</h1>
    <div>
      <v-row>
        <v-col cols="10">
          <v-text-field
            v-model="research"
            variant="solo"
            label="Collaborateur"
            bg-color="deep-purple-darken-3"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-magnify"
            color="deep-purple-darken-3"
            class="mr-3"
            @click="filterAssociates()"
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
      <v-row>
        <v-col cols="6" lg="2" md="2">
          <v-select
            label="Année"
            :items="years"
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
        <!-- <v-btn color="warning"> Absent </v-btn> -->
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
      <v-progress-circular
        indeterminate
        color="purple"
        v-if="loading"
      ></v-progress-circular>
      <v-row v-else class="rounded shadow m-2">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in filteredAssociates" :key="associate.id">
              <td>
                <p>
                  {{ associate.first_name + " " + associate.name }}
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-table class="col-11">
          <thead>
            <tr>
              <th v-for="year in weeksFiltered" :key="year.weekNumber">
                <span
                  class="bg-purple"
                  v-if="
                    year.startDate <= todayDate() && year.endDate >= todayDate()
                  "
                >
                  {{ "S" + year.weekNumber }}
                </span>
                <span v-else>
                  {{ "S" + year.weekNumber }}
                </span>
              </th>
            </tr>
            <tr>
              <th v-for="year in weeksFiltered" :key="year.weekNumber">
                <div v-if="nbContract(year)">
                  <span class="text-deep-purple-darken-3">
                    {{ totalTrue }}
                  </span>
                  /
                  <span class="text-deep-purple-lighten-4">
                    {{ totalFalse }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="associate in filteredAssociates" :key="associate.id">
              <td
                id="facture"
                v-for="year in weeksFiltered"
                :key="year.weekNumber"
              >
                <div style="display: flex">
                  <v-btn
                    color="deep-purple-darken-3"
                    v-if="isWorking(associate, year) == 1"
                  ></v-btn>
                  <v-btn
                    color="deep-purple-lighten-4"
                    v-else-if="isWorking(associate, year) == 2"
                  ></v-btn>
                  <v-btn
                    color="grey-lighten-1"
                    v-else-if="isWorking(associate, year) == 3"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-row>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="fetchData"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import {
  eachWeekOfInterval,
  getISOWeek,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
export default {
  name: "Pdc",
  data() {
    return {
      research: null,
      value: "",
      weeks: [],
      weeksFiltered: [],
      totalTrue: 0,
      totalFalse: 0,
      associates: "",
      allAssociates: "",
      associatesContrat: [],
      filteredAssociates: [],
      currentPage: 1,
      totalPages: 0,
      globalPage: 0,
      loading: true,
      searchLoading: false,
      selectedYear: 2023,
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      managers: [],
      selectedManager: null,
      selectedCustomer: null,
      selectedProject: null,
      calculatedAssociates: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    selectedYear(newYear) {
      this.totalTrue = 0;
      this.weeks = this.generateWeekList(newYear);
      this.weeksFilter();
    },
    currentPage(newPage) {
      this.fetchData(newPage);
    },
    research() {
      if (!this.research) {
        this.filterAssociates();
      }
    },
    selectedManager() {
      this.loading = true;
      this.filterAssociates();
      this.loading = false;
    },
    selectedCustomer() {
      this.loading = true;
      this.filterAssociates();
      this.loading = false;
    },
    selectedProject() {
      this.loading = true;
      this.filterAssociates();
      this.loading = false;
    },
  },

  methods: {
    //retourne les collaborateurs avec une pagination de 10
    async fetchData(page) {
      this.loading = true;
      const response = await Axios.get(
        `/associates?page=${page || this.currentPage}`
      );
      this.associates = response.data.associate;
      this.totalPages = response.data.totalPages;
      this.globalPages = response.data.totalPages;
      this.filterAssociates();
      this.loading = false;
    },
    //retourne la date du jour
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    //Retourne la liste complete des colloborateurs avec les informations actuelles
    calculateAssociate() {
      this.allAssociates.forEach((associate) => {
        const calculatedAssociate = {
          id: associate.id,
          first_name: associate.first_name,
          name: associate.name,
          project: this.projetEnCours(associate.id),
          customer: this.clientEnCours(associate.id),
          manager: this.managerEnCours(associate.id),
          Missions: associate.Missions,
        };
        this.calculatedAssociates.push(calculatedAssociate);
      });
      console.log(this.calculatedAssociates);
    },
    //Pour le filtrage par projet, permet de retourner le projet du collaborateur
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
    //Pour le filtrage par client, permet de retourner le client du collaborateur
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
    //Pour le filtrage par manager, permet de retourner le manager du collaborateur
    managerEnCours(associate_id) {
      var missionOfCollab = [];
      this.allAssociates.forEach((associate) => {
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
    //Donne le format de bdd aux dates
    formatDate(date) {
      const year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      if (month.length < 2) {
        month = "0" + month;
      }
      let day = date.getDate().toString();
      if (day.length < 2) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    },
    //filtre les résultat en fonction des filtres rentrée
    filterAssociates() {
      this.filteredAssociates = this.associates;
      this.totalPages = this.globalPages;

      if (this.research) {
        this.loading = true;
        const searchTerm = this.research.toLowerCase();
        this.totalPages = 1;
        this.filteredAssociates = this.allAssociates.filter((associate) => {
          const fullName = associate.first_name + " " + associate.name;
          return fullName.toLowerCase().includes(searchTerm);
        });
        this.totalPages = 1;
        this.loading = false;
      }

      if (this.selectedManager) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.manager.some(
              (manager) => manager === this.selectedManager
            )
        );
        this.totalPages = 1;
      }

      if (this.selectedCustomer) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.customer.some(
              (customer) => customer === this.selectedCustomer
            )
        );
        this.totalPages = 1;
      }

      if (this.selectedProject) {
        this.totalPages = 1;
        this.filteredAssociates = this.calculatedAssociates.filter(
          (associate) =>
            associate.project.some(
              (project) => project === this.selectedProject
            )
        );
        this.totalPages = 1;
      }
    },
    //Arrete la recherche et remet le plan de charge à l'original
    stopResearch() {
      this.research = null;
      this.filterAssociates();
    },
    //Retourne le nombre de personne qui sont en contrat et en intercontrat par semaine
    nbContract(week) {
      this.totalTrue = 0;
      this.totalFalse = 0;
      this.allAssociates.forEach((associate) => {
        if (this.isWorking(associate, week) == 1) {
          this.totalTrue++;
        } else if (this.isWorking(associate, week) == 2) {
          this.totalFalse++;
        }
      });
      return true;
    },
    // Permet de définir si la personne est en contrat ou en intercontrat
    isWorking(associate, year) {
      this.loading = true;
      if (
        associate.start_date >= year.endDate ||
        associate.end_date < year.startDate
      ) {
        this.loading = false;
        return 3;
      }
      for (let mission of associate.Missions) {
        if (
          mission.start_date < year.endDate &&
          mission.end_date > year.startDate
        ) {
          this.loading = false;
          return 1;
        }
      }
      this.loading = false;
      return 2;
    },
    //Génére la liste des semaines pour une année passé en paramètre et son année +1
    generateWeekList(year) {
      const startDate = new Date(year, 0, 1); // Premier jour de l'année
      const endDate = new Date(year + 1, 11, 31); // Dernier jour de l'année

      const allWeeks = eachWeekOfInterval({
        start: startDate,
        end: endDate,
        weekStartsOn: 1,
      });

      const weekList = allWeeks.map((date) => {
        const weekNumber = getISOWeek(date);
        const startDateOfWeek = startOfWeek(date, { weekStartsOn: 1 });
        const endDateOfWeek = endOfWeek(date, { weekStartsOn: 1 });
        return {
          weekNumber,
          startDate: format(startDateOfWeek, "yyyy-MM-dd"),
          endDate: format(endDateOfWeek, "yyyy-MM-dd"),
        };
      });

      return weekList;
    },
    //Retourne la liste de semaine entre la S14 et la S13 de l'année d'après
    weeksFilter() {
      this.weeksFiltered = [];
      let i = 0;
      let tour = false;
      this.weeks.forEach((week) => {
        i++;
        if (i > 14 && !tour) {
          this.weeksFiltered.push(week);
        } else if (i < 14 && tour == true) {
          this.weeksFiltered.push(week);
        }
        if (i == 53) {
          i = 0;
          tour = true;
        }
      });
    },
  },
  created() {
    Axios.get("/associates/pdc").then((res) => {
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

    this.weeks = this.generateWeekList(this.selectedYear);
    this.weeksFilter();

    // Initialise filteredAssociates avec la même valeur que associates
    this.filteredAssociates = [...this.associates];
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