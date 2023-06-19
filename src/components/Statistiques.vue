<template>
  <div class="container">
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab value="1">Statistiques</v-tab>
      <v-tab value="2">Business</v-tab>
      <v-tab value="3">Autres</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>
          <v-row>
            <v-select
              v-model="manager"
              label="Manager"
              :items="managers"
              item-title="full_name"
              item-value="id"
              variant="solo"
            ></v-select>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12">
              <GChart v-if="dataLoaded" type="LineChart" :options="chartOptions" :data="caDataChart" />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="2">
        <v-container> </v-container>
      </v-window-item>
      <v-window-item value="3">
        <v-row>
          <GChart type="LineChart" :data="caDataChart" />
        </v-row>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import { GChart } from "vue-google-charts";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "Statistiques",
  components: { GChart },
  data() {
    return {
      ca: [],
      nbHommes: 0,
      nbFemmes: 0,
      caDataChart: [],
      chartOptions: [],
      managers: [],
      manager: null,
      tab: null,
      associates: [],
      projectsOfManager: [],
      dataLoaded: false, // propriété pour savoir si les données sont chargées ou non
    };
  },
  created() {
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
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
      this.associates.forEach((person) => {
        if (person.gender_id == 1) {
          this.nbHommes++;
        } else if (person.gender_id == 2) {
          this.nbFemmes++;
        }
      });

      // this.chartData.datasets[0].data[0] = this.nbHommes;
      // this.chartData.datasets[0].data[1] = this.nbFemmes;

    });
  },

  watch: {
    manager(newManager) {
      this.ca = this.getCaOfManager(this.generateMonthList(2023), newManager);

      this.caDataChart = [
        ["Mois", "CA"],
        ...this.ca.map(({ month, value}) => [month, value])
      ],

      this.chartOptions = {
        chart: {
          title: "Chiffre d'affaire"
        }
      }
      this.dataLoaded = true
    },
  },

  methods: {
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },

    generateMonthList(year) {
      const list_start = startOfMonth(new Date(year, 3, 1));
      const list_end = startOfMonth(new Date(year + 1, 2, 1));
      const monthsList = eachMonthOfInterval({
        start: list_start,
        end: list_end,
        monthStartsOn: 1,
      });

      const allMonths = monthsList.map((date) => {
        const month = format(date, "MMMM", { locale: fr });
        const startDateOfWeek = startOfMonth(date, { weekStartsOn: 1 });
        const endDateOfWeek = endOfMonth(date, { weekEndsOn: 1 });
        return {
          monthNumber: month,
          start_date: format(startDateOfWeek, "yyyy-MM-dd"),
          end_date: format(endDateOfWeek, "yyyy-MM-dd"),
        };
      });
      console.log(allMonths);
      return allMonths;
    },

    getCaOfManager(months, managerSelected) {
      this.ca = [];
      let value = 0;
      this.managers.forEach((manager) => {
        if (manager.id == managerSelected) {
          months.forEach((month) => {
            manager.PRUs.forEach((PRU) => {
              if (
                PRU.start_date < month.start_date &&
                PRU.end_date > month.end_date
              ) {
                value -= PRU.value;
              }
            });
            manager.Projects.forEach((project) => {
              project.Missions.forEach((mission) => {
                if (
                  mission.start_date < month.start_date &&
                  mission.end_date > month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date < month.start_date &&
                      TJM.end_date > month.end_date
                    ) {
                      value += TJM.value;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date < month.start_date &&
                      PRU.end_date > month.end_date
                    ) {
                      value -= PRU.value;
                    }
                  });
                }
              });
            });
            this.ca.push({ month: month.monthNumber, value: value });
          });
        }
      });
      console.log(this.ca);
      return this.ca
    },
  },
};
</script>
