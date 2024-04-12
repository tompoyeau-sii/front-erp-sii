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

    <v-row class="p-3">
      <v-col lg="6">
        <h1 class="title d-inline-block">
          Évolution de {{ collab.first_name + " " + collab.name }}
        </h1>
      </v-col>
    </v-row>
    <v-col cols="6" lg="3" md="4" sm="6">
      <div class="shadow rounded-5 mt-5 p-4 bg-white">
        <p class="etiquette mb-2">Date d'embauche</p>
        <v-row justify="end">
          <p class="data m-2" v-text="formatDate(collab.start_date)"></p>
        </v-row>
      </div>
    </v-col>

    <v-col lg="6">
      <h2 class="title d-inline-block">PRU</h2>
    </v-col>

    <div class="table-responsive p-3">
      <table class="table rounded-3 shadow bg-white table-striped">
        <thead>
          <tr style="border: white">
            <th>Valeur</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Modifier</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pru in collab.PRUs" :key="pru">
            <td class="mt-auto mb-auto">
              <p v-text="pru.value"></p>
            </td>
            <td class="mt-auto mb-auto">
              <p v-text="formatDate(pru.start_date)"></p>
            </td>
            <td class="mt-auto mb-auto">
              <p v-text="formatDate(pru.end_date)"></p>
            </td>
            <td class="mt-auto mb-auto">
              <UpdatePRUForm
                :pru="pru"
                @pruUpdated="handlePruUpdate"
              ></UpdatePRUForm>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-col v-if="collab.Missions.length != 0" lg="6">
      <h2 class="title d-inline-block">TJM par missions</h2>
    </v-col>

    <v-col>
      <v-expansion-panels multiple v-if="collab.Missions.length != 0">
        <v-expansion-panel v-for="mission in collab.Missions" :key="mission">
          <v-expansion-panel-title>
            <strong>
              {{
                mission.Project.label +
                " - " +
                mission.Project.adv +
                " | " +
                mission.Project.Customer.label +
                " | Du " +
                formatDate(mission.date_range_mission[0].value) +
                " au " +
                formatDate(mission.date_range_mission[1].value)
              }}
            </strong>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="table-responsive p-3">
              <table class="table rounded-3 shadow bg-white table-striped">
                <thead>
                  <tr style="border: white">
                    <th>Valeur</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tjm in mission.TJMs" :key="tjm">
                    <td class="mt-auto mb-auto">
                      <p v-text="tjm.value"></p>
                    </td>
                    <td class="mt-auto mb-auto">
                      <p v-text="formatDate(tjm.start_date)"></p>
                    </td>
                    <td class="mt-auto mb-auto">
                      <p v-text="formatDate(tjm.end_date)"></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <!-- {{ collab.PRUs }} -->
    <v-snackbar
      v-if="SuccessState == true"
      v-model="snackbar"
      w-auto
      color="green"
      timeout="3000"
    >
      <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
      {{ success }}
    </v-snackbar>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import UpdatePRUForm from "@/components/forms/update/UpdatePRUForm.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "CollabGestion",
  components: {
    UpdatePRUForm,
  },
  data() {
    return {
      SupprDialog: false,
      collab: [],
      dialog: false,
      isEditMode: false,
      projects: [],
      SuccessState: false,
      error: "",
    };
  },
  created() {
    this.collab = this.$route.params.collab;
  },
  methods: {
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
    },
    handlePruUpdate() {
      this.fetchData();
    },
    fetchData() {
      Axios.get(`/associate/${this.collab.id}/all`)
        .then((response) => {
          this.collab = response.data;
        })
        .catch((error) => {
          console.error(error);
          router.push({ path: "/collaborateurs" });
        });
    },
    retourPagePrecedente() {
      this.$router.go(-1);
    },
    format(date) {
      return (date = format(new Date(date), "dd/MM/yyyy"));
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