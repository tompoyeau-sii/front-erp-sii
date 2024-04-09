<template>
  <v-container>
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab value="1">
        <v-icon icon="mdi-account-tie-outline" size="x-large"></v-icon>
        Managers
      </v-tab>
      <v-tab value="2">
        <v-icon icon="mdi-domain" size="x-large"></v-icon>
        Agence
      </v-tab>
      <v-tab value="3">
        <v-icon icon="mdi-office-building" size="x-large"></v-icon>
        Clients
      </v-tab>
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
                item-title="label"
                item-value="value"
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
          <v-col
            v-if="isSimulationActive && dataLoadedManager"
            cols="12"
            lg="4"
            md="6"
            sm="6"
          >
            <div class="bg-white shadow rounded-5 p-4">
              <p class="etiquette mb-2">Delta de fin d'année</p>
              <v-row justify="end" align="center">
                <v-icon
                  class="title"
                  icon="mdi-account-group"
                  size="x-large"
                ></v-icon>
                <p class="data m-2">{{ managerDelta }}%</p>
              </v-row>
            </div>
          </v-col>
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
                item-title="label"
                item-value="value"
                variant="solo"
              ></v-select>
            </v-col>
            <v-col cols="12">
                <GChart
                  v-if="dataLoadedAgence"
                  type="LineChart"
                  class="shadow rounded-3"
                  :options="chart.caOptions"
                  :data="chart.caData"
                />
            </v-col>
          </v-row>
          <v-col v-if="isSimulationActive" cols="12" lg="4" md="6" sm="6">
            <div class="bg-white shadow rounded-5 p-4">
              <p class="etiquette mb-2">Delta de fin d'année</p>
              <v-row justify="end" align="center">
                <v-icon
                  class="title"
                  icon="mdi-account-group"
                  size="x-large"
                ></v-icon>
                <p class="data m-2">{{ delta }}%</p>
              </v-row>
            </div>
          </v-col>
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
import { format } from "date-fns";
import { mapGetters } from "vuex";
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
      caForMonthsSimulation: [],
      caOfCustomer: [],
      caOfCustomerSimulation: [],
      filteredCustomers: [],
      nbHommes: 0,
      nbFemmes: 0,
      intercontrats: [],
      tab: null,
      associates: [],
      deltaManager: null,
      delta: null,
      missions: [],
      years: [
        { label: "2021 - 2022", value: 2021 },
        { label: "2022 - 2023", valeur: 2022 },
        { label: "2023 - 2024", valeur: 2023 },
        { label: "2024 - 2025", valeur: 2024 },
        { label: "2025 - 2026", valeur: 2025 },
        { label: "2026 - 2027", valeur: 2026 },
      ],
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
    Axios.get("/pdc/year")
      .then((res) => {
        this.yearSelected = res.data?.pdc.actual_year;
      })
      .then((res) => {
        Axios.get("http://localhost:8080/api/production/statistiques/agence", {
          params: {
            year: this.yearSelected,
          },
        }).then((prod) => {
          if (
            this.getSimulationMode == "true" ||
            localStorage.getItem("isSimulation") == "true"
          ) {
            Axios.get("/statistiques/agence", {
              params: {
                year: this.yearSelected,
              },
            }).then((simu) => {
              this.caForMonths = prod.data?.caForMonths;
              this.caForMonthsSimulation = simu.data?.caForMonths; // Nouvelle série de données
              this.deltaData = this.caForMonths.map((monthData, index) => ({
                month: monthData.month,
                delta:
                  this.caForMonthsSimulation[index].value - monthData.value,
              }));
              this.chart.caData = [
                ["Mois", "CA", "CA Simulation"], // Ajout de la deuxième série
                ...this.caForMonths.map(({ month, value }, index) => [
                  month,
                  value,
                  this.caForMonthsSimulation[index].value,
                ]), // Même index est utilisé pour correspondre aux valeurs de la première série avec la deuxième
              ];
              this.chart.caOptions = {
                title: "Chiffre d'affaire de l'agence",
                
                colors: ["#4527A0", "#e84653", "#fb8c00"],
              };
              this.dataLoadedAgence = true;
              const percentageData = this.caForMonths.map(
                (monthData, index) => {
                  const actualValue = monthData.value;
                  const simulatedValue =
                    this.caForMonthsSimulation[index].value;
                  const percentageDifference =
                    ((actualValue - simulatedValue) / simulatedValue) * 100;
                  return {
                    month: monthData.month,
                    percentageDifference: percentageDifference.toFixed(2), // Arrondi à deux décimales
                  };
                }
              );

              this.delta =
                percentageData[percentageData.length - 1].percentageDifference;
            });
          } else {
            this.caForMonths = prod.data?.caForMonths;
            this.chart.caData = [
              ["Mois", "CA Prod"], // Ajout de la deuxième série
              ...this.caForMonths.map(({ month, value }) => [month, value]), // Même index est utilisé pour correspondre aux valeurs de la première série avec la deuxième
            ];
            this.chart.caOptions = {
              title: "Chiffre d'affaire de l'agence",
              colors: ["#4527A0"],
            };
            this.dataLoadedAgence = true;
          }
        });

        //Calcul collaborteurs chez le client
        Axios.get("http://localhost:8080/api/production/customers").then(
          (prod) => {
            this.customers = prod.data?.customer;
            this.filteredCustomers = this.filterAssociate(this.customers);
            if (
              this.getSimulationMode == "true" ||
              localStorage.getItem("isSimulation") == "true"
            ) {
              Axios.get("/customers").then((simu) => {
                let filteredCustomersSimulation = this.filterAssociate(
                  simu.data?.customer
                );
                this.chart.customerData = [
                  ["Client", "Collab", "Collab Simulation"],
                  ...this.filteredCustomers.map(
                    ({ label, nbCollab }, index) => [
                      label,
                      nbCollab,
                      filteredCustomersSimulation[index].nbCollab,
                    ]
                  ),
                ];
                this.chart.customerOptions = {
                  title: "Nombre de collaborateurs par clients",
                  colors: ["#4527A0", "#e84653"],
                };
              });
            } else {
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
            }
          }
        );
      });
  },

  watch: {
    managerSelected(newManager) {
      Axios.get("http://localhost:8080/api/production/statistiques/manager", {
        params: {
          year: this.yearSelected,
          manager: newManager,
        },
      }).then((prod) => {
        if (this.isSimulationActive) {
          Axios.get("/statistiques/manager", {
            params: {
              year: this.yearSelected,
              manager: newManager,
            },
          }).then((simu) => {
            var ca = prod.data?.ca;
            var caSimulation = simu.data?.ca;

            this.deltaData = ca.map((monthData, index) => ({
              month: monthData.month,
              delta: caSimulation[index].value - monthData.value,
            }));

            (this.chart.managerData = [
              ["Mois", "CA", "CA Simulation"],
              ...ca.map(({ month, value }, index) => [
                month,
                value,
                caSimulation[index].value,
              ]),
            ]),
              (this.chart.managerOptions = {
                title: "Chiffre d'affaire du manager",
                colors: ["#4527A0", "#e84653"],
              });
            (this.chart.managerMargeData = [
              ["Mois", "Marge", "Marge simulation"],
              ...ca.map(({ month, marge }, index) => [
                month,
                marge,
                caSimulation[index].marge,
              ]),
            ]),
              (this.chart.managerMargeOptions = {
                title: "Marge du manager",
                colors: ["#4527A0", "#e84653"],
              });

            const percentageData = ca.map((monthData, index) => {
              const actualValue = monthData.value;
              const simulatedValue = caSimulation[index].value;
              const percentageDifference =
                ((actualValue - simulatedValue) / simulatedValue) * 100;
              return {
                month: monthData.month,
                percentageDifference: percentageDifference.toFixed(2), // Arrondi à deux décimales
              };
            });
            this.managerDelta =
              percentageData[percentageData.length - 1].percentageDifference;
            this.dataLoadedManager = true;
          });
        } else {
          var ca = prod.data?.ca;
          (this.chart.managerData = [
            ["Mois", "CA"],
            ...ca.map(({ month, value }) => [month, value]),
          ]),
            (this.chart.managerOptions = {
              title: "Chiffre d'affaire du manager",
              colors: ["#4527A0"],
            });
          (this.chart.managerMargeData = [
            ["Mois", "Marge"],
            ...ca.map(({ month, marge }) => [month, marge]),
          ]),
            (this.chart.managerMargeOptions = {
              title: "Marge du manager",
              colors: ["#4527A0"],
            });
          this.dataLoadedManager = true;
        }
      });
    },
    yearSelected(newYear) {
      //Si un manager est séléctionné, alors on recalcul son chiffre
      if (this.managerSelected) {
        Axios.get("http://localhost:8080/api/production/statistiques/manager", {
          params: {
            year: this.yearSelected,
            manager: this.managerSelected,
          },
        }).then((prod) => {
          if (this.isSimulationActive) {
            Axios.get("/statistiques/manager", {
              params: {
                year: this.yearSelected,
                manager: this.managerSelected,
              },
            }).then((simu) => {
              var ca = prod.data?.ca;
              var caSimulation = simu.data?.ca;
              var deltaData = ca.map((monthData, index) => ({
                month: monthData.month,
                delta: monthData.value - caSimulation[index].value,
              }));
              (this.chart.managerData = [
                ["Mois", "CA", "CA Simulation", "Delta"],
                ...ca.map(({ month, value }, index) => [
                  month,
                  value,
                  caSimulation[index].value,
                  deltaData[index].delta,
                ]),
              ]),
                (this.chart.managerOptions = {
                  title: "Chiffre d'affaire du manager",
                  colors: ["#4527A0", "#e84653", "#fb8c00"],
                });
              (this.chart.managerMargeData = [
                ["Mois", "Marge", "Marge simulation"],
                ...ca.map(({ month, marge }, index) => [
                  month,
                  marge,
                  caSimulation[index].marge,
                ]),
              ]),
                (this.chart.managerMargeOptions = {
                  title: "Marge du manager",
                  colors: ["#4527A0", "#e84653"],
                });
              this.dataLoadedManager = true;
            });
          } else {
            var ca = prod.data?.ca;
            (this.chart.managerData = [
              ["Mois", "CA"],
              ...ca.map(({ month, value }) => [month, value]),
            ]),
              (this.chart.managerOptions = {
                title: "Chiffre d'affaire du manager",
                colors: ["#4527A0"],
              });
            (this.chart.managerMargeData = [
              ["Mois", "Marge"],
              ...ca.map(({ month, marge }) => [month, marge]),
            ]),
              (this.chart.managerMargeOptions = {
                title: "Marge du manager",
                colors: ["#4527A0"],
              });
            this.dataLoadedManager = true;
          }
        });
      }
      //Calcul du CA global de l'agence
      Axios.get("http://localhost:8080/api/production/statistiques/agence", {
        params: {
          year: newYear,
        },
      }).then((prod) => {
        if (
          this.getSimulationMode == "true" ||
          localStorage.getItem("isSimulation") == "true"
        ) {
          Axios.get("/statistiques/agence", {
            params: {
              year: newYear,
            },
          }).then((simu) => {
            this.caForMonths = prod.data?.caForMonths;
            this.caForMonthsSimulation = simu.data?.caForMonths; // Nouvelle série de données
            this.deltaData = this.caForMonths.map((monthData, index) => ({
              month: monthData.month,
              delta: monthData.value - this.caForMonthsSimulation[index].value,
            }));
            this.chart.caData = [
              ["Mois", "CA", "CA Simulation", "Delta"], // Ajout de la deuxième série
              ...this.caForMonths.map(({ month, value }, index) => [
                month,
                value,
                this.caForMonthsSimulation[index].value,
                this.deltaData[index].delta,
              ]), // Même index est utilisé pour correspondre aux valeurs de la première série avec la deuxième
            ];
            this.chart.caOptions = {
              title: "Chiffre d'affaire de l'agence",
              colors: ["#4527A0", "#e84653", "#fb8c00"],
            };
            this.dataLoadedAgence = true;
          });
        } else {
          this.caForMonths = prod.data?.caForMonths;
          this.chart.caData = [
            ["Mois", "CA Prod"], // Ajout de la deuxième série
            ...this.caForMonths.map(({ month, value }) => [month, value]), // Même index est utilisé pour correspondre aux valeurs de la première série avec la deuxième
          ];
          this.chart.caOptions = {
            title: "Chiffre d'affaire de l'agence",
            colors: ["#4527A0"],
          };
          this.dataLoadedAgence = true;
        }
      });
    },
    customerSelected(newCustomer) {
      Axios.get("http://localhost:8080/api/production/statistiques/customer", {
        params: {
          customer: this.customerSelected,
          year: this.refYear,
        },
      }).then((prod) => {
        if (this.isSimulationActive) {
          Axios.get("/statistiques/customer", {
            params: {
              customer: this.customerSelected,
              year: this.refYear,
            },
          }).then((simu) => {
            let caOfCustomer = prod.data?.caOfCustomer;
            let caOfCustomerSimulation = simu.data?.caOfCustomer;

            (this.chart.customerCaData = [
              ["Mois", "CA", "CA simulation"],
              ...caOfCustomer.map(({ month, value }, index) => [
                month,
                value,
                caOfCustomerSimulation[index].value,
              ]),
            ]),
              (this.chart.customerCaOptions = {
                title: "Chiffre d'affaire du client",
                colors: ["#4527A0", "#e84653"],
              });
            this.dataLoadedCustomer = true;
          });
        } else {
          let caOfCustomer = prod.data?.caOfCustomer;
          (this.chart.customerCaData = [
            ["Mois", "CA"],
            ...caOfCustomer.map(({ month, value }, index) => [month, value]),
          ]),
            (this.chart.customerCaOptions = {
              title: "Chiffre d'affaire du client",
              colors: ["#4527A0"],
            });
          this.dataLoadedCustomer = true;
        }
      });
    },
  },

  computed: {
    managers() {
      return this.$store.getters.getManagers;
    },
    isSimulationActive() {
      return (
        this.simulationMode === "true" ||
        localStorage.getItem("isSimulation") === "true"
      );
    },
    refYear() {
      return this.$store.getters.getRefYear;
    },
  },

  methods: {
    ...mapGetters(["getSimulationMode"]),
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
  },
};
</script>
<style scoped>
.etiquette {
  color: #a9a9a9;
}

svg {
  border-radius: 8px !important;
}

.data {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
}
</style>
