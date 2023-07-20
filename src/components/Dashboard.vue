<template>
  <v-container>
    <v-row class="p-3">
      <v-col lg="6">
        <h1 class="title mt-3 mb-5">Tableau de bord</h1>
      </v-col>
    </v-row>

    <p v-for="offDay in offDaysPastYear" :key="offDay">
      {{ offDay }}
    </p>

    <v-row>
      <v-col cols="12" lg="4" md="6" sm="6">
        <div class="bg-white shadow rounded-5 p-4">
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

      <v-col cols="12" lg="4" md="6" sm="6">
        <div class="bg-white shadow rounded-5 p-4">
          <p class="etiquette mb-2">
            Chiffre d'affaires depuis le début de l'exercice
          </p>
          <v-row justify="end">
            <v-icon
              class="title"
              icon="mdi-currency-eur"
              size="x-large"
            ></v-icon>
            <p class="data m-2">
              {{ formatK(getCaGlobal(generateMonthList(2023))) }}
            </p>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" lg="4">
        <div class="bg-white shadow rounded-5 p-4">
          <p class="etiquette mb-2">Évolution du chiffre d'affaires</p>
          <v-row justify="end">
            <v-icon class="title" icon="mdi-finance" size="x-large"></v-icon>
            <p
              v-if="
                getEvolutionCA(
                  getCaGlobal(generateMonthList(2023)),
                  getCaGlobalLastYear(generateMonthList(2022))
                ) >
                0 + '%'
              "
              class="data text-green m-2"
            >
              {{
                getEvolutionCA(
                  getCaGlobal(generateMonthList(2023)),
                  getCaGlobalLastYear(generateMonthList(2022))
                )
              }}
            </p>
            <p v-else class="data m-2 text-red">
              {{
                getEvolutionCA(
                  getCaGlobal(generateMonthList(2023)),
                  getCaGlobalLastYear(generateMonthList(2022))
                )
              }}
            </p>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4" md="6" sm="6">
        <div class="bg-white shadow rounded-5 p-4">
          <p class="etiquette mb-2">Moyenne d'age</p>
          <v-row justify="end">
            <v-icon
              class="title"
              icon="mdi-account-group"
              size="x-large"
            ></v-icon>
            <p class="data m-2">{{ ageMoy + " ans" }}</p>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" lg="8" class="shadow rounded-5 p-5 mt-5 gradient">
        <p class="pb-5">CA par client depuis le début de l'exercice</p>
        <v-row>
          <v-col
            cols="12"
            lg="3"
            md="6"
            sm="6"
            v-for="customer in customers"
            :key="customer.id"
          >
            <p style="font-weight: bold; font-size: 4vh">
              {{ getCaOfCustomer(customer.id) }}€
            </p>
            <span>{{ customer.label }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import axios from "axios";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
  subYears,
  parse,
  differenceInYears,
  getDaysInMonth,
  getYear,
  getMonth,
  eachWeekendOfMonth,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import { ca, fr } from "date-fns/locale";
export default {
  name: "dashboard",
  data() {
    return {
      associates: [],
      customers: [],
      missions: [],
      ageMoy: null,
      offDays: [],
      offDaysPastYear: [],
      offDaysActualYear: [],
      offDaysNextYear: [],
    };
  },
  created() {
    Axios.get("/associates/pdc").then((res) => {
      this.associates = res.data?.associate;
      let moy = 0;
      this.associates.forEach((associate) => {
        moy += this.calculateAge(associate.birthdate);
      });
      this.ageMoy = moy / this.associates.length;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
    Axios.get("/missions").then((res) => {
      this.missions = res.data?.mission;
    });
    axios.get("https://calendrier.api.gouv.fr/jours-feries/metropole/2022.json").then((res) => {
      this.offDaysPastYear = res.data;
      console.log(this.offDaysPastYear)
    })
    axios.get("https://calendrier.api.gouv.fr/jours-feries/metropole/2023.json").then((res) => {
      this.offDaysActualYear = res.data;
      this.offDaysActualYear.forEach((day) => {
        this.offDays.push(day)
      })
      console.log(this.offDaysActualYear)
    })
    axios.get("https://calendrier.api.gouv.fr/jours-feries/metropole/2024.json").then((res) => {
      this.offDaysNextYear = res.data;
      this.offDaysNextYear.forEach((day) => {
        this.offDays.push(day)
      })
      console.log(this.offDaysNextYear)
    })
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
    getCaGlobal(year) {
      let ca = 0;
      this.caForMonths = [];
      year.forEach((month) => {
        let monthISO = parse(month.start_date, "yyyy-MM-dd", new Date());
        // let nbJours = getDaysInMonth(getYear(monthISO), getMonth(monthISO));
        // let nbWeekend = eachWeekendOfMonth(
        //   getYear(monthISO),
        //   getMonth(monthISO)
        // );
        // nbJours = parse(nbJours, "yyyy-MM-dd", new Date());
        let nbDay = this.getWorkingDaysInMonth(
          getYear(monthISO),
          getMonth(monthISO)
        );
        if (month.start_date <= this.todayDate()) {
          this.associates.forEach((associate) => {
            associate.PRUs.forEach((PRU) => {
              if (
                PRU.start_date <= month.start_date &&
                PRU.end_date >= month.end_date
              ) {
                ca -= PRU.value * nbDay;
              } else if (
                PRU.start_date >= month.start_date &&
                PRU.start_date <= month.end_date
              ) {
                ca -= PRU.value * nbDay;
              } else if (
                PRU.end_date >= month.start_date &&
                PRU.end_date <= month.end_date
              ) {
                ca -= PRU.value * nbDay;
              }
            });
          });
          this.missions.forEach((mission) => {
            mission.TJMs.forEach((tjm) => {
              if (
                tjm.start_date <= month.start_date &&
                tjm.end_date >= month.end_date
              ) {
                ca += tjm.value * nbDay;
              } else if (
                tjm.start_date >= month.start_date &&
                tjm.start_date <= month.end_date
              ) {
                ca += tjm.value * nbDay;
              } else if (
                tjm.end_date >= month.start_date &&
                tjm.end_date <= month.end_date
              ) {
                ca += tjm.value * nbDay;
              }
            });
          });
        }
      });
      return ca;
    },
    getWorkingDaysInMonth(year, month) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);



      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      const workingDays = allDays.filter((day) => !isWeekend(day));

      return workingDays.length;
    },
    getCaGlobalLastYear(months) {
      let ca = 0;
      this.caForMonths = [];
      months.forEach((month) => {
        const todayString = this.todayDate(); // Appelez votre méthode qui retourne la date du jour sous forme de chaîne
        const today = parse(todayString, "yyyy-MM-dd", new Date());
        var previousYear = subYears(today, 1);
        previousYear = format(previousYear, "yyyy-MM-dd");
        if (month.start_date <= previousYear) {
          this.associates.forEach((associate) => {
            associate.PRUs.forEach((PRU) => {
              if (
                PRU.start_date <= month.start_date &&
                PRU.end_date >= month.end_date
              ) {
                ca -= PRU.value;
              } else if (
                PRU.start_date >= month.start_date &&
                PRU.start_date <= month.end_date
              ) {
                ca -= PRU.value;
              } else if (
                PRU.end_date >= month.start_date &&
                PRU.end_date <= month.end_date
              ) {
                ca -= PRU.value;
              }
            });
          });
          this.missions.forEach((mission) => {
            mission.TJMs.forEach((tjm) => {
              if (
                tjm.start_date <= month.start_date &&
                tjm.end_date >= month.end_date
              ) {
                ca += tjm.value;
              } else if (
                tjm.start_date >= month.start_date &&
                tjm.start_date <= month.end_date
              ) {
                ca += tjm.value;
              } else if (
                tjm.end_date >= month.start_date &&
                tjm.end_date <= month.end_date
              ) {
                ca += tjm.value;
              }
            });
          });
        }
      });
      return ca;
    },
    getEvolutionCA(todayCA, lastYearCA) {
      ca = todayCA - lastYearCA;
      ca = ca / Math.abs(lastYearCA);
      ca = ca * 100;
      return ca.toFixed(0) + "%";
    },
    calculateAge(dateOfBirth) {
      const today = new Date();
      return differenceInYears(today, new Date(dateOfBirth));
    },
    formatK(number) {
      if (number >= 1000) {
        return number / 1000 + "K";
      } else if (number < -1000) {
        return number / 1000 + "K";
      } else {
        return number;
      }
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