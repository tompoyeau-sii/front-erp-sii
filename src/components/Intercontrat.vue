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
    <v-row>
      <v-col lg="6">
        <h1 class="title">Intercontrat</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <div class="bg-white shadow rounded-5 mt-3 p-4">
          <p class="mb-2 etiquette">Perte quotitdienne</p>
          <v-row justify="end" align="center">
            <v-icon
              class="title"
              icon="mdi-currency-eur"
              size="x-large"
            ></v-icon>
            <p class="data m-2">{{ totalLost() }}</p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="8">
        <div class="table-responsive p-3">
          <table class="table rounded-3 shadow bg-white table-striped">
            <thead>
              <tr style="border: white">
                <th>Collaborateur</th>
                <th>PRU</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="intercontrat in intercontrats" :key="intercontrat.id">
                <td style="display: flex; align-content: center">
                  <v-avatar>
                    <v-img
                      src="../assets/img/collab/generic.png"
                      alt="John"
                    ></v-img>
                  </v-avatar>
                  <p
                    class="mt-auto mb-auto ml-2"
                    v-text="intercontrat.first_name + ' ' + intercontrat.name"
                  ></p>
                </td>
                <td
                  class="mt-auto mb-auto"
                  v-if="pruEnCours(intercontrat.id) != ''"
                  v-text="
                    pruEnCours(intercontrat.id)
                      .map((project) => project)
                      .join(', ')
                  "
                ></td>
                <td>
                  <router-link
                    :to="{
                      name: 'FicheCollabView',
                      params: { id: intercontrat.id },
                    }"
                  >
                    <v-icon start icon="mdi-open-in-new"></v-icon>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
export default {
  name: "Intercontrat",
  data() {
    return {
      customers: [],
      intercontrats: [],
    };
  },
  methods: {
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    retourPagePrecedente() {
      this.$router.go(-1);
    },

    totalLost() {
      var total = 0;
      this.intercontrats.forEach((associate) => {
        total += parseInt(this.pruEnCours(associate.id))
      })
      return total;
    },

    pruEnCours(associate_id) {
      var pruOfCollab = [];
      this.intercontrats.forEach((associate) => {
        if (associate.id == associate_id) {
          associate.PRUs.forEach((pru) => {
            if (
              pru.start_date <= this.todayDate() &&
              pru.end_date >= this.todayDate()
            ) {
              pruOfCollab.push(pru.value);
            }
          });
        }
      });
      return pruOfCollab;
    },
  },
  created() {
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
.manager {
  background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
  color: white;
  width: 33vh;
  min-width: 200px;
}
.data {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
}
.etiquette {
  color: #a9a9a9;
}
</style>