<template>
  <v-container>
    <h1 class="title mt-3 mb-5">Tableau de bord</h1>
    <v-row>
      <v-col cols="12" lg="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Total de collaborateurs SII Le Mans</p>
          <v-row justify="end">
              <v-icon
                class="title"
                icon="mdi-account-group"
                size="x-large"
              ></v-icon>
              <p class="data m-2" v-text="associates.length"></p>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" lg="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Chiffres d'affaires SII Le Mans</p>
          <v-row justify="end">
            <v-icon
              class="title"
              icon="mdi-currency-eur"
              size="x-large"
            ></v-icon>
            <p class="data m-2">104</p>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" lg="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Évolution du chiffre d'affaires</p>
          <v-row justify="end">
            <v-icon class="title" icon="mdi-finance" size="x-large"></v-icon>
            <p class="data m-2">104</p>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-col cols="12" lg="8" offset-lg="4" class="shadow rounded-5 p-5 mt-5 gradient">
      <p class="pb-5">CA par client depuis le début de l'exercice</p>
      <v-row>
        <v-col cols="12" lg="3" v-for="customer in customers" :key="customer.id">
          <p style="font-weight: bold; font-size: 4vh;">{{ getCaOfCustomer(customer.id) }}€</p>
          <span>{{ customer.label }}</span>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "dashboard",
  data() {
    return {
      associates: [],
      customers: [],
    };
  },
  created() {
    Axios.get("/associates/pdc").then((res) => {
      this.associates = res.data?.associate;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
  },

  methods: {
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
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
        const startDateOfMonth = startOfMonth(date, { weekStartsOn: 1 });
        const endDateOfMonth = endOfMonth(date, { weekEndsOn: 1 });
        return {
          monthNumber: month,
          start_date: format(startDateOfMonth, "yyyy-MM-dd"),
          end_date: format(endDateOfMonth, "yyyy-MM-dd"),
        };
      });
      return allMonths;
    },
    getCaOfCustomer(customerSelected) {
      let ca = 0;
      let months = this.generateMonthList(2023);
      this.customers.forEach((customer) => {
        if (customer.id == customerSelected) {
          months.forEach((month) => {
            if (month.start_date <= this.todayDate()) {
              customer.Projects.forEach((project) => {
                project.Missions.forEach((mission) => {
                  if (
                    mission.start_date <= month.start_date &&
                    mission.end_date >= month.end_date
                  ) {
                    mission.TJMs.forEach((tjm) => {
                      if (
                        tjm.start_date <= month.start_date &&
                        tjm.end_date >= month.end_date
                      ) {
                        ca += tjm.value;
                      }
                    });
                    mission.Associate.PRUs.forEach((pru) => {
                      if (
                        pru.start_date <= month.start_date &&
                        pru.end_date >= month.end_date
                      ) {
                        ca -= pru.value;
                      }
                    });
                  } else if (
                    mission.start_date >= month.start_date &&
                    mission.start_date < month.end_date
                  ) {
                    mission.TJMs.forEach((TJM) => {
                      if (
                        TJM.start_date <= month.start_date &&
                        TJM.end_date >= month.end_date
                      ) {
                        ca += TJM.value;
                        console.log(customer.label + " : " + ca);
                      } else if (
                        TJM.start_date >= month.start_date &&
                        TJM.start_date < month.end_date
                      ) {
                        ca += TJM.value;
                      }
                    });
                    mission.Associate.PRUs.forEach((PRU) => {
                      if (
                        PRU.start_date <= month.start_date &&
                        PRU.end_date >= month.end_date
                      ) {
                        ca -= PRU.value;
                      } else if (
                        PRU.start_date >= month.start_date &&
                        PRU.start_date < month.end_date
                      ) {
                        ca -= PRU.value;
                      }
                    });
                    //Si la mission termine pendant le mois en cours
                  } else if (
                    mission.end_date >= month.start_date &&
                    mission.end_date <= month.end_date
                  ) {
                    mission.TJMs.forEach((TJM) => {
                      if (
                        TJM.start_date <= month.start_date &&
                        TJM.end_date >= month.end_date
                      ) {
                        ca += TJM.value;
                      } else if (
                        TJM.end_date >= month.start_date &&
                        TJM.end_date < month.end_date
                      ) {
                        ca += TJM.value;
                      }
                    });
                    mission.Associate.PRUs.forEach((PRU) => {
                      if (
                        PRU.start_date <= month.start_date &&
                        PRU.end_date >= month.end_date
                      ) {
                        ca -= PRU.value;
                      } else if (
                        PRU.end_date >= month.start_date &&
                        PRU.end_date < month.end_date
                      ) {
                        ca -= PRU.value;
                      }
                    });
                  }
                });
              });
            }
          });
        }
      });
      return ca;
    },
  },
};
</script>

<style scoped>
.etiquette {
  color: #a9a9a9;
}

.data {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
}
</style>