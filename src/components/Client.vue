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
          <p>{{ customer.value }}€</p>
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
import {
  format,
} from "date-fns";

export default {
  name: "Client",
  components: {
    AddClientForm,
  },
  data() {
    return {
      intercontrats: [],
      error: "",
      SuccessState: false,
      snackbar: false,
      nbCollab: [],
      customers: []
    };
  },
  created() {
    
  },
  methods: {
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    formatK(number) {
      if (number >= 1000) {
        let res = number / 1000
        return res.toFixed(0) + "K"
      } else if (number < -1000) {
        let res = number / 1000
        return res.toFixed(0) + "K"
      } else {
        return number;
      }
    },
    filterAssociate(customer) {
      const associateIds = Set();

      customer.Projects.forEach((project) => {
        project.Missions.forEach((mission) => {
          if(mission.date_range_mission[0].value <= this.todayDate() && mission.date_range_mission[1].value >= this.todayDate()) {
            associateIds.add(mission.associate_id);
          }
        });
      });

      const nbCollab = associateIds.size;
      return nbCollab;
    },
  },
  created() {
    Axios.get("/statistiques/customer/actualMonth").then((res) => {
      this.customers = res.data?.caOfActualMonthCustomer
      console.log(this.customers)
    })
    // lister les intercontrats
    Axios.get("/associates/all").then((res) => {
      res.data?.associate.forEach((associate) => {
        // on vérifie que l'associé est bien dans l'entreprise
        if (associate.start_date < this.todayDate()) {
          // Si le collaborateurs à encore eu 0 mission
          if (associate.Missions.length == 0) {
            let add = 0;
            associate.Jobs.forEach((job) => {
              if (add == 0) {
                // On regarde si il es manager 
                if (job.label != "Manager") {
                  // Si il n'est pas manager, alors on il est en intercontrat
                  add = 1;
                  this.intercontrats.push(associate);
                }
              }
            });
          } else {
            var enMission = false;
            associate.Missions.forEach((mission) => {
              if (
                mission.date_range_mission[0].value <= this.todayDate() &&
                mission.date_range_mission[1].value >= this.todayDate()
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
