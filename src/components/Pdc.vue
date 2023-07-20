<template>
  <v-container>
    <h1 class="title">Plan de charge</h1>

    <v-progress-circular
      indeterminate
      color="purple"
      v-if="loading"
    ></v-progress-circular>

    <div v-else>
      <v-text-field
        v-model="search"
        clearable
        variant="solo"
        label="Collaborateur"
      ></v-text-field>
      <v-row>
        <v-col cols="8">
          <v-select
            label="Année"
            :items="years"
            variant="solo"
            density="compact"
            v-model="selectedYear"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn class="mr-2" color="deep-purple-darken-3"> En mission </v-btn>
          <v-btn class="mr-2" color="deep-purple-lighten-4 ">
            Intercontrat
          </v-btn>
          <v-btn class="mr-2" color="grey-lighten-1 "> Hors entreprise </v-btn>
        </v-col>
        <!-- <v-btn color="warning"> Absent </v-btn> -->
      </v-row>
      <v-row class="rounded shadow m-2">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in associatesContrat" :key="associate.id">
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
            <tr v-for="associate in associatesContrat" :key="associate.id">
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
        <!-- <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="fetchData"
        ></v-pagination> -->
        </v-row>
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
      search: null,
      weeks: [],
      weeksFiltered: [],
      totalTrue: 0,
      totalFalse: 0,
      associates: "",
      associatesContrat: [],
      filteredAssociates: [],
      currentPage: 1,
      totalPages: 0,
      loading: true,
      selectedYear: 2023,
      years: [2020, 2021, 2022, 2023, 2024, 2025],
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
    search() {
      this.filterAssociates();
    },
  },

  methods: {
    async fetchData(page) {
      this.loading = true;
      const response = await Axios.get(
        `/associates?page=${page || this.currentPage}`
      );
      this.associates = response.data.associate;
      this.totalPages = response.data.totalPages;
      this.loading = false;

      // Mettre à jour filteredAssociates
      this.filteredAssociates = [...this.associates];
    },
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
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

    filterAssociates() {
      if (!this.search) {
        this.filteredAssociates = this.associates;
      } else {
        const searchTerm = this.search.toLowerCase();
        this.filteredAssociates = this.associates.filter((associate) => {
          const fullName = associate.first_name + " " + associate.name;
          return fullName.toLowerCase().includes(searchTerm);
        });
      }
    },

    nbContract(week) {
      this.totalTrue = 0;
      this.totalFalse = 0;
      this.associatesContrat.forEach((associate) => {
        if (this.isWorking(associate, week) == 1) {
          this.totalTrue++;
        } else if (this.isWorking(associate, week) == 2) {
          this.totalFalse++;
        }
      });
      return true;
    },

    isWorking(associate, year) {
      if (
        associate.start_date >= year.endDate ||
        associate.end_date < year.startDate
      ) {
        return 3;
      }
      for (let mission of associate.Missions) {
        if (
          mission.start_date < year.endDate &&
          mission.end_date > year.startDate
        ) {
          return 1;
        }
      }
      return 2;
    },

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
      this.associatesContrat = res.data?.associate;
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