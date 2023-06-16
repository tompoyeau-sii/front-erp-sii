<template>
  <div class="container">
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab value="1">Statistiques</v-tab>
      <v-tab value="2">Business</v-tab>
      <v-tab value="3">Autres</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>
          <v-row>
            <v-select
              v-model="manager"
              label="Manager"
              :items="managers"
              item-title="full_name"
              item-value="id"
              variant="solo"
            ></v-select>
          </v-row>
          {{ ca }}
        </v-container>
      </v-window-item>
      <v-window-item value="2">
        <v-row>
          <GChart type="PieChart" :data="chartData" />
        </v-row>
      </v-window-item>
      <v-window-item value="3">
        <v-row>
          <GChart type="PieChart" :data="chartData" />
        </v-row>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import { GChart } from "vue-google-charts";
import { format } from "date-fns";
export default {
  name: "Statistiques",
  components: { GChart },
  data() {
    return {
      ca: 0,
      nbHommes: 0,
      nbFemmes: 0,
      chartData: [],
      managers: [],
      manager: null,
      tab: null,
      associates: [],
      projectsOfManager: [],
      dataLoaded: false, // propriété pour savoir si les données sont chargées ou non
    };
  },
  created() {
    Axios.get("/associates/managers").then((res) => {
      //this.managers = res.data?.associate;
      res.data?.associate.forEach((job) => {
        job.Associates.forEach((manager) => {
          if (
            manager.Associate_Job.start_date < this.todayDate() &&
            manager.Associate_Job.end_date > this.todayDate()
          ) {
            manager.full_name = manager.first_name + " " + manager.name;
            this.managers.push(manager);
          }
        });
      });
    });
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
      this.associates.forEach((person) => {
        if (person.gender_id == 1) {
          this.nbHommes++;
        } else if (person.gender_id == 2) {
          this.nbFemmes++;
        }
      });

      // this.chartData.datasets[0].data[0] = this.nbHommes;
      // this.chartData.datasets[0].data[1] = this.nbFemmes;

      (this.chartData = [
        ["Element", "Quantity"],
        ["Hommes", this.nbHommes],
        ["Femmes", this.nbFemmes],
      ]),
        (this.dataLoaded = true); // marquer les données comme chargées
    });
  },

  watch: {
    manager(newManager) {
      this.getCaOfManager();
    },
  },

  methods: {
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
    getCaOfManager() {
      let ca = 0;
      this.managers.forEach((manager) => {
        if (manager.id == this.manager) {
          manager.Projects.forEach((project) => {
            project.Missions.forEach((mission) => {
              mission.TJMs.forEach((TJM) => {
                ca += TJM.value;
              });
              mission.Associate.PRUs.forEach((PRU) => {
                if(PRU.start_date < this.todayDate() && PRU.end_date > this.todayDate()) {
                  ca -= PRU.value;
                }
              })
            });
          });
        }
      });
      this.ca = ca;
    },
  },
};
</script>
