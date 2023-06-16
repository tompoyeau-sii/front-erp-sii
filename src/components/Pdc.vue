<template>
  <div class="container">
    <router-link class="retour" to="/dashboard">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>

    <h1 class="title">Plan de charge</h1>

    <v-progress-circular
      indeterminate
      color="purple"
      v-if="loading"
    ></v-progress-circular>

    <div class="display" v-else>
      <v-select
        label="Année"
        :items="years"
        variant="solo"
        density="compact"
        v-model="selectedYear"
      ></v-select>
      <v-row justify="end" class="mb-3">
        <v-btn class="mr-2" color="deep-purple-darken-3"> En mission </v-btn>
        <v-btn class="mr-2" color="deep-purple-lighten-4 ">
          Intercontrat
        </v-btn>
        <!-- <v-btn color="warning"> Absent </v-btn> -->
      </v-row>
      <div class="row">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in associates" :key="associate.id">
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
                {{'S'+ year.weekNumber }}
              </th>
            </tr>
            <tr>
              <th v-for="year in weeksFiltered" :key="year.weekNumber">
                <div v-if="nbContract(year)">
                  <span class="text-deep-purple-darken-3" >
                    {{ totalTrue }}
                  </span>
                  /
                  <span class="text-deep-purple-lighten-4">{{ totalFalse }}</span>

                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="associate in associates" :key="associate.id">
              <td
                id="facture"
                v-for="year in weeksFiltered"
                :key="year.weekNumber"
              >
                <div style="display: flex">
                  <v-btn
                    color="deep-purple-darken-3"
                    v-if="isWorking(associate, year)"
                  ></v-btn>
                  <v-btn color="deep-purple-lighten-4" v-else></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
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
      weeks: [],
      weeksFiltered: [],
      totalTrue: 0,
      totalFalse: 0,
      associates: "",
      loading: true,
      selectedYear: 2023,
      years: [2020, 2021, 2022, 2023, 2024, 2025],
    };
  },

  watch: {
    selectedYear(newYear) {
      this.totalTrue = 0;
      this.weeks = this.generateWeekList(newYear);
      this.weeksFilter();
    },
  },

  methods: {
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

    nbContract(week) {
      this.totalTrue = 0;
      this.totalFalse = 0;
      this.associates.forEach((associate) => {
        if (this.isWorking(associate, week)) {
          this.totalTrue++;
        } else {
          this.totalFalse++;
        }
      });
      return true;
    },

    isWorking(associate, year) {
      for (let mission of associate.Missions) {
        if (
          mission.start_date < year.endDate &&
          mission.end_date > year.startDate
        ) {
          return true;
        }
      }
      return false;
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
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
      this.loading = false;
    });

    // this.weeks = this.getWeeksOfYear(2023);
    this.weeks = this.generateWeekList(this.selectedYear);
    this.weeksFilter();
    console.log(this.weeks);
    console.log(this.weeksFiltered);
  },
};
</script>

<style scoped>
.associate {
  position: fixed;
  background-color: white;
  z-index: 1;
  max-width: 100px;
  min-width: 100px;
}

p {
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
}
</style>