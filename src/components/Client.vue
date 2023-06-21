<template>
  <div class="container">
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
          <p>100 000€</p>
          <p :v-text="filterAssociate(customer) + ' collaborateurs'"></p>
        </div>
      </router-link>
    </div>
    <div class="row">
      <router-link
        class="col-2 intercontrat rounded-3 m-2 pt-3 shadow-sm"
        to="/dashboard"
      >
        <div>
          <p class="text-h5 name" v-text="'Intercontrat'"></p>
          <p v-text="intercontrats.nbCollab + ' collaborateurs'"></p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddClientForm from "@/components/forms/AddClientForm.vue";
import { mapGetters } from "vuex";
import { format } from "date-fns";
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
    filterAssociate(customer) {
      var nbCollab = [];
      customer.Projects.forEach((project) => {
        project.Missions.forEach((mission) => {
          if(nbCollab == []) {
            console.log("null");
            nbCollab.push(mission)
          }
          var exist = false;
          console.log("null");
          nbCollab.forEach((el) => {
            if (el.associate_id == mission.associate_id) {
              exist = true;
            } else {
              console.log("on ajoute un nouveau");
              this.nbCollab.push(element);
              exist = false;
            }
          });
        });
      });
      return nbCollab.length;
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
      console.log(this.customers);
    });
    Axios.get("/associates").then((res) => {
      res.data?.associate.forEach((associate) => {
        if (associate.Missions.length == 0) {
          this.intercontrats.push(associate);
        } else {
          var enMission = false;
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date < this.todayDate() &&
              mission.end_date > this.todayDate()
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
