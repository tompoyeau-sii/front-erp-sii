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
            <v-col cols="12" lg="6">
              <v-select
                v-model="manager"
                label="Manager"
                :items="managers"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
            <v-col cols="12" lg="6">
              <v-select
                v-model="yearSelected"
                label="Année"
                :items="years"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12">
              <GChart
                v-if="dataLoaded"
                type="LineChart"
                :options="chart.managerOptions"
                :data="chart.managerData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="2">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="yearSelected"
                label="Année"
                :items="years"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <GChart
                type="LineChart"
                :options="chart.caOptions"
                :data="chart.caData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="3">
        <GChart
          type="ColumnChart"
          :data="chart.customerData"
          :options="chart.customerOptions"
        />
        <!-- <GChart
          type="PieChart"
          :options="chart.pariteOptions"
          :data="chart.pariteData"
        /> -->
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
      yearSelected: 2023,
      nbHommes: 0,
      nbFemmes: 0,
      managers: [],
      projects: [],
      caForMonths: [],
      customers: [],
      filteredCustomers: [],
      intercontrats: [],
      manager: null,
      tab: null,
      associates: [],
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      projectsOfManager: [],
      dataLoaded: false, // propriété pour savoir si les données sont chargées ou non
      chart: {
        pariteData: [],
        pariteOptions: [],
        managerData: [],
        managerOptions: [],
        customerData: [],
        customerOptions: [],
        caData: [],
        caOptions: [],
      },
    };
  },
  created() {
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
      this.filteredCustomers = this.filterAssociate(this.customers);
      this.chart.customerData = [
        ["Client", "Collaborateurs"],
        ...this.filteredCustomers.map(({ label, nbCollab }) => [
          label,
          nbCollab,
        ]),
      ];
      this.chart.customerOptions = {
        title: "Nombre de collaborateurs chez les clients",
      };
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
    Axios.get("/associates/pdc").then((res) => {
      this.associates = res.data?.associate;
      this.associates.forEach((associate) => {
        if (associate.gender_id == 1) {
          this.nbHommes++;
        } else if (associate.gender_id == 2) {
          this.nbFemmes++;
        }
        if (associate.Missions.length == 0) {
          this.intercontrats.push(associate);
        } else {
          var enMission = false;
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date <= this.todayDate() &&
              mission.end_date >= this.todayDate()
            ) {
              enMission = true;
              return;
            }
          });
          if (enMission == false) {
            this.intercontrats.push(associate);
          }
        }
      });
      this.chart.pariteData = [
        ["Genre", "Population"],
        ["Hommes", this.nbHommes][("Femmes", this.nbFemmes)],
      ];
      this.chart.pariteOptions = {
        title: "Parité Hommes/Femmes",
      };
      this.intercontrats.nbCollab = this.intercontrats.length;
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
      console.log(this.projects);
      this.getCaGlobal(this.generateMonthList(2023));
      (this.chart.caData = [
        ["Mois", "CA"],
        ...this.caForMonths.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.caOptions = {
          title: "Chiffre d'affaire de l'agence",
        });
    });
  },

  watch: {
    manager(newManager) {
      this.ca = this.getCaOfManager(
        this.generateMonthList(this.yearSelected),
        newManager
      );

      (this.chart.managerData = [
        ["Mois", "CA"],
        ...this.ca.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.managerOptions = {
          title: "Chiffre d'affaire du manager",
        });
      this.dataLoaded = true;
    },
    yearSelected(newYear) {
      if (this.manager) {
        this.ca = this.getCaOfManager(
          this.generateMonthList(newYear),
          this.manager
        );

        (this.chart.managerData = [
          ["Mois", "CA"],
          ...this.ca.map(({ month, value }) => [month, value]),
        ]),
          (this.chart.managerOptions = {
            title: "Chiffre d'affaire du manager",
          });
        this.dataLoaded = true;
      }
      this.getCaGlobal(this.generateMonthList(newYear));
      this.chart.caData = [
        ["Mois", "CA"],
        ...this.caForMonths.map(({ month, value }) => [month, value]),
      ];
    },
  },

  methods: {
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },

    filterAssociate(customers) {
      const result = [];

      customers.forEach((customer) => {
        const associateIds = new Set();

        customer.Projects.forEach((project) => {
          project.Missions.forEach((mission) => {
            associateIds.add(mission.associate_id);
          });
        });

        const nbCollab = associateIds.size;

        const customerResult = {
          label: customer.label,
          nbCollab: nbCollab,
        };
        result.push(customerResult);
      });

      return result;
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
                PRU.start_date <= month.end_date && // Vérifie si la date de début du PRU est antérieure ou égale à la date de fin du mois
                PRU.end_date >= month.start_date // Vérifie si la date de fin du PRU est postérieure ou égale à la date de début du mois
              ) {
                value -= PRU.value;
              }
            });
            manager.Projects.forEach((project) => {
              project.Missions.forEach((mission) => {
                if (
                  mission.start_date <= month.start_date &&
                  mission.end_date >= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
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
      return this.ca;
    },
    getCaGlobal(months) {
      let ca = 0;
      this.caForMonths = [];
      months.forEach((month) => {
        this.projects.forEach((project) => {
          project.Associate.PRUs.forEach((managerPRU) => {
            if (
              managerPRU.start_date < month.start_date &&
              managerPRU.end_date > month.end_date
            ) {
              ca -= managerPRU.value;
            }
          });
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
                  ca += TJM.value;
                }
              });
              mission.Associate.PRUs.forEach((PRU) => {
                if (
                  PRU.start_date < month.start_date &&
                  PRU.end_date > month.end_date
                ) {
                  ca -= PRU.value;
                }
              });
            }
          });
        });
        this.caForMonths.push({ month: month.monthNumber, value: ca });
      });
    },
  },
};
</script>
