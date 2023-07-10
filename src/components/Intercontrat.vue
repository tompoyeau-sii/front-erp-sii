<template>
  <div class="container">
    <v-row class="mt-3">
      <v-col lg="6">
        <h1 class="pt-3 pb-3 title">Intercontrat</h1>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col
        cols="12"
        lg="4"
        md="4"
        sm="6"
        v-for="intercontrat in intercontrats"
        :key="intercontrat.id"
      >
        <router-link
          :to="{
            name: 'FicheCollabView',
            params: { id: intercontrat.id },
          }"
        >
          <div class="row col-4 manager rounded-3 m-2 pt-3 shadow-sm">
            <v-col cols="3" style="padding-top: 0">
              <v-avatar>
                <v-img
                  src="https://source.unsplash.com/random/150x150?person"
                  alt="John"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="9">
              <p v-text="intercontrat.first_name + ' ' + intercontrat.name"></p>
            </v-col>
          </div>
        </router-link>
      </v-col>
    </v-row>
  </div>
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
  },
  created() {
    Axios.get("/associates/pdc").then((res) => {
      let add = 0;
      res.data?.associate.forEach((associate) => {
        if (associate.Missions.length == 0) {
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
      });
    });
  },
};
</script>

<style>
.manager {
  background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
  color: white;
  width: 33vh;
  min-width: 200px;
}
</style>