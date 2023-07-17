<template>
  <v-container>
    <v-row class="mt-3">
      <v-col lg="6">
        <h1 class="pt-3 pb-3 title">Clients SII Le Mans</h1>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <AddClientForm />
        </v-col>
      </v-row>
    </v-row>
    <div class="row">
      <router-link
        class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
        v-for="customer in customers"
        :key="customer.id"
        :to="{ name: 'FicheClientView', params: { id: customer.id } }"
      >
        <div>
          <p class="text-h5 name" v-text="customer.label"></p>
          <p>{{ getCaOfCustomer(customer.id) }}€</p>
          <p>{{ filterAssociate(customer) + " collaborateurs" }}</p>
        </div>
      </router-link>
    </div>
    <div class="row">
      <router-link
        class="col-2 intercontrat rounded-3 m-2 pt-3 shadow-sm"
        to="/intercontrat"
      >
        <div>
          <p class="text-h5 name" v-text="'Intercontrat'"></p>
          <p v-text="intercontrats.nbCollab + ' collaborateurs'"></p>
        </div>
      </router-link>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddClientForm from "@/components/forms/AddClientForm.vue";
import { mapGetters } from "vuex";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "Client",
  components: {
    AddClientForm,
  },
  data() {
    return {
      customers: [],
      intercontrats: [],
      error: "",
      SuccessState: false,
      snackbar: false,
      test: this.$store.getters.getToken,
      nbCollab: [],
    };
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
            if (
              month.start_date <= this.todayDate()
              ) {
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
                        console.log(customer.label + ' : '+ ca)
                        
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

    filterAssociate(customer) {
      const associateIds = new Set();

      customer.Projects.forEach((project) => {
        project.Missions.forEach((mission) => {
          associateIds.add(mission.associate_id);
        });
      });

      const nbCollab = associateIds.size;
      return nbCollab;
    },
    refresh() {
      this.customers = [];
      Axios.get("/customers").then((res) => {
        this.customers = res.data?.customer;
      });
    },
  },
  created() {
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
    Axios.get("/associates/pdc").then((res) => {
      res.data?.associate.forEach((associate) => {
        if (associate.start_date < this.todayDate()) {
        if (associate.Missions.length == 0) {
          let add = 0;
          associate.Jobs.forEach((job) => {
            if (add == 0) {
              if (job.label != "Manager") {
                add = 1;
                this.intercontrats.push(associate);
              }
            }
          });
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
      }
      });
      this.intercontrats.nbCollab = this.intercontrats.length;
    });
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}

.client {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  /* background: linear-gradient(135deg, #0FF0B3 0%, #036ED9 100%);
  background: linear-gradient(135deg, #65799B 0%, #5E2563 100%); */
  color: white;
  width: 20vh;
  min-width: 200px;
}

.intercontrat {
  background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}
.name {
  font-weight: 600;
}
</style>
