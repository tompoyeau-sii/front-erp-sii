<template>
  <v-container>
    <v-row class="p-3">
      <v-col lg="6">
        <h1 class="title d-inline-block">Tableau de bord</h1>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col cols="12" lg="4" md="6" sm="6">
          <div class="bg-white shadow rounded-5 p-4">
            <p class="etiquette mb-2">Total de collaborateurs SII Le Mans</p>
            <v-row justify="end" align="center">
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
            <v-row justify="end" align="center">
              <v-icon
                class="title"
                icon="mdi-currency-eur"
                size="x-large"
              ></v-icon>
              <p class="data m-2">
                {{ formatK(getCaOfAgence()) }}
              </p>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" lg="4">
          <div class="bg-white shadow rounded-5 p-4">
            <p class="etiquette mb-2">Évolution du chiffre d'affaires</p>
            <v-row justify="end" align="center">
              <v-icon class="title" icon="mdi-finance" size="x-large"></v-icon>
              <p
                v-if="
                  getEvolutionCA(getCaOfAgence(), getCaLastYearOfAgence()) > 0
                "
                class="data text-green m-2"
              >
                {{ getEvolutionCA(getCaOfAgence(), getCaLastYearOfAgence()) }}%
              </p>
              <p
                v-else-if="
                  getEvolutionCA(getCaOfAgence(), getCaLastYearOfAgence()) == 0
                "
                class="data text-red m-2"
              >
                {{ getEvolutionCA(getCaOfAgence(), getCaLastYearOfAgence()) }}%
              </p>
              <p v-else class="data text-red m-2">
                {{ getEvolutionCA(getCaOfAgence(), getCaLastYearOfAgence()) }}%
              </p>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="4" md="6" sm="6">
          <div class="bg-white shadow rounded-5 p-4">
            <p class="etiquette mb-2">Moyenne d'age</p>
            <v-row justify="end" align="center">
              <v-icon
                class="title"
                icon="mdi-account-group"
                size="x-large"
              ></v-icon>
              <p v-if="ageMoy" class="data m-2">{{ ageMoy + " ans" }}</p>
              <p v-else class="data m-2">0 an</p>
            </v-row>
          </div>
          <div class="bg-white shadow rounded-5 mt-5 p-4">
            <p class="etiquette mb-2">État d'avancement</p>
            <v-row v-if="goal > 5" justify="end" align="center">
              <v-icon
                v-if="goal > 5"
                class="text-green"
                icon="mdi-elevation-rise"
                size="x-large"
              ></v-icon>
              <p class="data m-2 text-green">En avance</p>
            </v-row>
            <v-row v-else-if="goal < -5" justify="end" align="center">
              <v-icon
                class="text-red"
                icon="mdi-elevation-decline"
                size="x-large"
              ></v-icon>
              <p class="data m-2 text-red">En retard</p>
            </v-row>
            <v-row v-else justify="end" align="center">
              <v-icon
                class="text-orange"
                icon="mdi-sine-wave"
                size="x-large"
              ></v-icon>
              <p class="data m-2 text-orange">Conforme</p>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" lg="8" class="shadow rounded-5 mt-3 p-5 gradient">
          <v-row>
            <v-col lg="6">
              <p class="pb-5">CA par client depuis le début de l'exercice</p>
            </v-col>
            <v-row justify="end">
              <v-col lg="6">
                <v-btn-toggle
                  v-model="type"
                  color="white"
                  variant="text"
                  mandatory
                  shaped
                >
                  <v-btn value="CA">CA</v-btn>
                  <v-btn value="tjm">TJM/PRU</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-row>
          <v-row v-if="type=='CA'">
            <v-col
              cols="12"
              lg="3"
              md="6"
              sm="6"
              v-for="customer in customers"
              :key="customer.id"
            >
              <p style="font-weight: bold; font-size: 4vh">
                {{ formatK(customer.value) }}€
              </p>
              <span>{{ customer.label }}</span>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
              cols="12"
              lg="3"
              md="6"
              sm="6"
              v-for="customer in customers"
              :key="customer.id"
            >
              <p style="font-weight: bold; font-size: 4vh">
                <span v-if="customer.total_tjm">{{ customer.total_tjm }}€</span>
                <span v-else>0€</span>
                 / 
                <span v-if="customer.total_pru">{{ customer.total_pru }}€</span>
                <span v-else>0€</span>
              </p>
              <span>{{ customer.label }}</span>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format, differenceInYears } from "date-fns";
import { mapActions } from "vuex";
import { ca } from "date-fns/locale";
export default {
  name: "dashboard",
  data() {
    return {
      date: [],
      associates: [],
      ageMoy: null,
      type: "CA",
      goal: 5,
      offDays: [],
      caOfCustomers: 0,
      agenceCa: 0,
      lastYearAgenceCa: 0,
      evolCa: 0,
      selectedYear: null,
      month: null,
      customers: [],
    };
  },
  async created() {
    Axios.get("pdc/year").then((res) => {
      this.selectedYear = res.data?.pdc.actual_year;
      Axios.get("/statistiques/customer/actualMonth", {
        params: {
          year: this.selectedYear,
        },
      }).then((res) => {
        this.customers = res.data?.caOfActualMonthCustomer;
      });
      Axios.get("/associates/all").then((res) => {
        this.associates = res.data?.associate;
        console.log(this.associates);
        let moy = 0;
        this.associates.forEach((associate) => {
          moy += this.calculateAge(associate.birthdate);
        });
        this.ageMoy = (moy / this.associates.length).toFixed(0);
      });
    });
    this.initApp();
  },

  methods: {
    ...mapActions(["initApp"]),
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    getEvolutionCA(todayCA, lastYearCA) {
      ca = todayCA - lastYearCA;
      ca = ca / Math.abs(lastYearCA);
      ca = ca * 100;
      return ca.toFixed(0);
    },
    calculateAge(dateOfBirth) {
      const today = new Date();
      return differenceInYears(today, new Date(dateOfBirth));
    },
    formatK(number) {
      if (number >= 1000) {
        let res = number / 1000;
        return res.toFixed(0) + "K";
      } else if (number < -1000) {
        let res = number / 1000;
        return res.toFixed(0) + "K";
      } else {
        return number;
      }
    },
    getCaOfAgence() {
      let today = this.todayDate();
      Axios.get("pdc/year").then((res) => {
        this.selectedYear = res.data?.pdc.actual_year;
        Axios.get("/statistiques/agence", {
          params: {
            year: this.selectedYear,
          },
        }).then((ca) => {
          ca.data?.caForMonths.forEach((month) => {
            if (today >= month.start_month && today <= month.end_month) {
              this.agenceCa = month.value;
            }
          });
        });
      });
      return this.agenceCa;
    },
    getCaLastYearOfAgence() {
      let today = this.todayDate();
      Axios.get("pdc/year").then((res) => {
        this.selectedYear = res.data?.pdc.actual_year;
        Axios.get("/statistiques/agence", {
          params: {
            year: this.selectedYear,
          },
        }).then((ca) => {
          ca.data?.caForMonths.forEach((month) => {
            if (today >= month.start_month && today <= month.end_month) {
              this.month = month.month;
              this.agenceCa = month.value;
            }
          });
          Axios.get("/statistiques/agence", {
            params: {
              year: this.selectedYear - 1,
            },
          }).then((ca) => {
            ca.data?.caForMonths.forEach((month) => {
              if (this.month == month.month) {
                this.lastYearAgenceCa = month.value;
              }
            });
          });
        });
      });
      return this.lastYearAgenceCa;
    },
  },
};
</script>

<style scoped>
.etiquette {
  color: #a9a9a9;
}

p {
  text-align: start;
}

.data {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
}
</style>