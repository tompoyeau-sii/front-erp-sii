<template>
  <v-container>
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab value="1">Managers</v-tab>
      <v-tab value="2">Agence</v-tab>
      <v-tab value="3">Clients</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-select
                v-model="managerSelected"
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
                v-if="dataLoadedManager"
                type="LineChart"
                class="shadow"
                :options="chart.managerOptions"
                :data="chart.managerData"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12">
              <GChart
                v-if="dataLoadedManager"
                type="ColumnChart"
                class="shadow"
                :options="chart.managerMargeOptions"
                :data="chart.managerMargeData"
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
                v-if="dataLoadedAgence"
                type="LineChart"
                class="shadow"
                :options="chart.caOptions"
                :data="chart.caData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="3">
        <v-col cols="12">
          <GChart
            type="ColumnChart"
            class="shadow"
            :data="chart.customerData"
            :options="chart.customerOptions"
          />
        </v-col>
        <!-- <GChart
          type="PieChart"
          :options="chart.pariteOptions"
          :data="chart.pariteData"
        /> -->
        <v-col cols="12">
          <v-select
            v-model="customerSelected"
            label="Client"
            :items="customers"
            item-title="label"
            item-value="id"
            variant="solo"
          ></v-select>

          <GChart
            v-if="dataLoadedCustomer"
            type="LineChart"
            class="shadow"
            :data="chart.customerCaData"
            :options="chart.customerCaOptions"
          />
        </v-col>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { GChart } from "vue-google-charts";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
  getYear,
  getMonth,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "Statistiques",
  components: { GChart },
  data() {
    return {
      // Select
      yearSelected: 2023,
      customerSelected: null,
      managerSelected: null,

      //Liste initialisé par les listes de données reçu par l'API
      projects: [],
      customers: [],
      caForMonths: [],
      caOfCustomer: [],
      filteredCustomers: [],
      nbHommes: 0,
      nbFemmes: 0,
      intercontrats: [],
      tab: null,
      associates: [],
      missions: [],
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      projectsOfManager: [],

      //Data loarder
      dataLoadedManager: false, // propriété pour savoir si les données sont chargées ou non
      dataLoadedAgence: false,
      dataLoadedCustomer: false,

      chart: {
        //Parité homme /femme
        pariteData: [],
        pariteOptions: [],

        //graphique ca des managers
        managerData: [],
        managerOptions: [],

        //graphique marge des managers
        managerMargeData: [],
        managerMargeOptions: [],

        //graphique nb collab chez les clients
        customerData: [],
        customerOptions: [],

        //graphique ca par client
        customerCaData: [],
        customerCaOptions: [],

        //ca global de l'agence
        caData: [],
        caOptions: [],
      },
    };
  },
  created() {
    Axios.get("/statistiques/agence", {
      params: {
        year: this.yearSelected,
      },
    }).then((res) => {
      this.caForMonths = res.data?.caForMonths;
      this.chart.caData = [
        ["Mois", "CA"],
        ...this.caForMonths.map(({ month, value }) => [month, value]),
      ];
      this.chart.caOptions = {
        title: "Chiffre d'affaire de l'agence",
        colors: ["#4527A0"],
      };
      this.dataLoadedAgence = true;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
      this.filteredCustomers = this.filterAssociate(this.customers);
      this.chart.customerData = [
        ["Client", "Collab"],
        ...this.filteredCustomers.map(({ label, nbCollab }) => [
          label,
          nbCollab,
        ]),
      ];
      this.chart.customerOptions = {
        title: "Nombre de collaborateurs par clients",
        colors: ["#4527A0"],
      };
    });
  },

  watch: {
    managerSelected(newManager) {
      Axios.get("/statistiques/manager", {
        params: {
          year: this.yearSelected,
          manager: newManager,
        },
      }).then((res) => {
        this.ca = res.data?.ca;
        (this.chart.managerData = [
          ["Mois", "CA"],
          ...this.ca.map(({ month, value }) => [month, value]),
        ]),
          (this.chart.managerOptions = {
            title: "Chiffre d'affaire du manager",
            colors: ["#4527A0"],
          });

        (this.chart.managerMargeData = [
          ["Mois", "Marge"],
          ...this.ca.map(({ month, marge }) => [month, marge]),
        ]),
          (this.chart.managerMargeOptions = {
            title: "Marge du manager",
            colors: ["#4527A0"],
          });
        this.dataLoadedManager = true;
      });
    },
    yearSelected(newYear) {
      //Si un manager est séléctionné, alors on recalcul son chiffre
      if (this.managerSelected) {
        Axios.get("/statistiques/manager", {
          params: {
            year: newYear,
            manager: this.managerSelected,
          },
        }).then((res) => {
          this.ca = res.data?.ca;
          (this.chart.managerData = [
            ["Mois", "CA"],
            ...this.ca.map(({ month, value }) => [month, value]),
          ]),
            (this.chart.managerOptions = {
              title: "Chiffre d'affaire du manager",
              colors: ["#4527A0"],
            });

          (this.chart.managerMargeData = [
            ["Mois", "Marge"],
            ...this.ca.map(({ month, marge }) => [month, marge]),
          ]),
            (this.chart.managerMargeOptions = {
              title: "Marge du manager",
              colors: ["#4527A0"],
            });

          this.dataLoadedManager = true;
        });
      }
      //Calcul du CA global de l'agence
      Axios.get("/statistiques/agence", {
        params: {
          year: newYear,
        },
      }).then((res) => {
        this.caForMonths = res.data?.caForMonths;
        this.chart.caData = [
          ["Mois", "CA"],
          ...this.caForMonths.map(({ month, value }) => [month, value]),
        ];
      });
    },
    customerSelected(newCustomer) {
      Axios.get("/statistiques/customer", {
        params: {
          customer: this.customerSelected,
        },
      }).then((res) => {
        this.caOfCustomer = res.data?.caOfCustomer;
        (this.chart.customerCaData = [
          ["Mois", "CA"],
          ...this.caOfCustomer.map(({ month, value }) => [month, value]),
        ]),
          (this.chart.customerCaOptions = {
            title: "Chiffre d'affaire du client",
            colors: ["#4527A0"],
          });
        this.dataLoadedCustomer = true;
      });
    },
  },

  computed: {
    managers() {
      return this.$store.getters.getManagers;
    },
  },

  methods: {
    //Méthode afin de récupérer la date du jour
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
    //Permet de retourner le nombre de nb collaborateurs que possède un client sans doublon
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
    getWorkingDaysInMonth(year, month) {
      // Attendre que getOffDays ait fini son traitement avant de continuer

      let startDate = new Date(year, month, 1);
      let endDate = new Date(year, month + 1, 0);

      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      const workingDays = allDays.filter((day) => !isWeekend(day));

      let nbJours = workingDays.length;

      return nbJours;
    },
    //Génére la liste des mois de l'année passée en paramètre allant de S14 à S13
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
        const startDateOfMonth = startOfMonth(date, { weekStartsOn: 1 });
        const endDateOfMonth = endOfMonth(date, { weekEndsOn: 1 });

        let nbDay = this.getWorkingDaysInMonth(
          getYear(startDateOfMonth),
          getMonth(startDateOfMonth)
        );

        // console.log(format(startDateOfMonth, "yyyy-MM-dd") + ' : ' + nbDay)

        return {
          monthNumber: month,
          start_date: format(startDateOfMonth, "yyyy-MM-dd"),
          end_date: format(endDateOfMonth, "yyyy-MM-dd"),
          nb_day: nbDay,
        };
      });
      // console.log(allMonths)
      return allMonths;
    },
  },
};
</script>
