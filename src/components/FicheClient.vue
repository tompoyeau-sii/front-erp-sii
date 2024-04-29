<template>
  <v-container>
    <v-row>
      <v-col class="mt-2">
        <v-btn
          size="small"
          variant="text"
          @click="retourPagePrecedente"
          prepend-icon="mdi-arrow-left"
          >Retour</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col lg="6">
        <h5 class="title mt-5 d-inline-block">{{ customer.label }}</h5>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <UpdateClientForm
            :customer_id="customer.id"
            :customer="customer.label"
            @customerUpdated="handleCustomerUpdate"
          />
        </v-col>
      </v-row>
    </v-row>

    <v-row>
      <v-col cols="12" lg="4" md="6" sm="6">
        <div class="bg-white shadow rounded-5 p-4">
          <p class="etiquette mb-2">TJM Moyen</p>
          <v-row justify="end" align="center">
            <v-icon
              class="title"
              icon="mdi-currency-eur"
              size="x-large"
            ></v-icon>
            <p v-if="tjm_moyen" class="data m-2">{{ tjm_moyen }}</p>
            <p v-else class="data m-2">0</p>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" lg="4" md="6" sm="6">
        <div class="bg-white shadow rounded-5 p-4">
          <p class="etiquette mb-2">PRU Moyen</p>
          <v-row justify="end" align="center">
            <v-icon
              class="title"
              icon="mdi-currency-eur"
              size="x-large"
            ></v-icon>
            <p v-if="pru_moyen" class="data m-2">
              {{ pru_moyen }}
            </p>
            <p v-else class="data m-2">0</p>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col lg="6">
        <h5 class="title d-inline-block" v-if="projects.length !== 0">
          Projets
        </h5>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <AddProjectForm
            :customer_id="customer.id"
            @customerUpdated="handleCustomerUpdate"
          />
        </v-col>
      </v-row>
    </v-row>
    <!-- Affichage de la liste de projet avec chaque collab assigné -->
    <div class="row">
      <div v-for="project in projects" :key="project.id"></div>
      <div
        class="table-responsive p-3 col-lg-6 col-md-12"
        v-for="project in projects"
        :key="project.id"
      >
        <table class="table rounded-3 shadow bg-white">
          <v-row justify="center" class="m-2">
            <h5 class="title" v-text="project.label"></h5>
          </v-row>
          <tbody>
            <v-row> </v-row>
            <tr v-for="mission in project.Missions" :key="mission.id">
              <td
                v-if="
                  mission.date_range_mission[0].value < todayDate() &&
                  mission.date_range_mission[1].value > todayDate()
                "
                style="display: flex; align-content: center"
              >
                <v-avatar>
                  <v-img
                    src="../assets/img/collab/generic.png"
                    alt="John"
                  ></v-img>
                </v-avatar>
                <p
                  class="mt-auto mb-auto ml-2"
                  v-text="
                    mission.Associate.first_name + ' ' + mission.Associate.name
                  "
                ></p>
              </td>
              <td
                v-if="
                  mission.date_range_mission[0].value < todayDate() &&
                  mission.date_range_mission[1].value > todayDate()
                "
              >
                <router-link
                  :to="{
                    name: 'FicheCollabView',
                    params: { id: mission.Associate.id },
                  }"
                >
                  <v-icon start icon="mdi-open-in-new"></v-icon>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <v-row v-if="projects.length !== 0" justify="center">
        <AddMissionForm
          :customer_id="customer.id"
          @customerUpdated="handleCustomerUpdate"
        />
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddProjectForm from "@/components/forms/add/AddProjectForm.vue";
import AddMissionForm from "@/components/forms/add/AddMissionForm.vue";
import UpdateClientForm from "@/components/forms/update/UpdateClientForm.vue";
import { format } from "date-fns";
export default {
  name: "FicheClient",
  components: {
    AddMissionForm,
    AddProjectForm,
    UpdateClientForm,
  },
  data() {
    return {
      SupprDialog: false,
      managers: [],
      customer: [],
      dialog: false,
      projects: [],
      tjm_moyen: 0,
      pru_moyen: 0,
      SuccessState: false,
      error: "",
    };
  },
  created() {
    this.tjm_moyen = this.$route.params.client.total_tjm;
    this.pru_moyen = this.$route.params.client.total_pru;
    this.customer = this.$route.params.client.customer;
    console.log(this.customer);
    this.projects = this.$route.params.client.customer.Projects;
  },
  methods: {
    retourPagePrecedente() {
      this.$router.go(-1);
    },
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    handleCustomerUpdate() {
      this.fetchData();
    },
    fetchData() {
      Axios.get("/pdc/year").then((res) => {
        Axios.get(`/customer/${this.customer.id}`, {
          params: {
            year: res.data?.pdc.actual_year,
          },
        })
          .then((response) => {
            console.log(response)
            // Pass the client data as a prop to the component
            this.customer = response.data.customer;
            this.projects = response.data.customer.Projects;
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
  },
};
</script>

<style scoped>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
.manager {
  background: linear-gradient(135deg, #0ff0b3 0%, #036ed9 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}
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