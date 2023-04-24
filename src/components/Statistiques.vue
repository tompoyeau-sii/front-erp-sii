<template>
  <div class="container">
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab :value="1">Statistiques</v-tab>
      <v-tab :value="2">Business</v-tab>
      <v-tab :value="3">Abstract</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="n in 3" :key="n" :value="n">
        <v-container fluid>
          <v-row>
            <v-col class="border shadow rounded-3 m-5" cols="12" md="3">
              <h5>Hommes / Femmes</h5>
              <Pie
                v-if="dataLoaded"
                id="my-chart-id"
                :options="chartOptions"
                :data="chartData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { Bar, Pie, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";
ChartJS.register(
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "Statistiques",
  components: { Bar, Pie, Doughnut },
  data() {
    return {
      tab: null,
      associates: [],
      nbHommes: 0,
      nbFemmes: 0,
      chartData: {
        labels: ["Homme", "Femme"],
        datasets: [
          {
            data: [this.nbHommes, this.nbFemmes],
            backgroundColor: ["#75519B", "#E84654"],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
      dataLoaded: false, // propriété pour savoir si les données sont chargées ou non
    };
  },
  created() {
    axios.get("http://localhost:8080/api/associates").then((res) => {
      this.associates = res.data?.associate;
      console.log(this.associates);
      this.associates.forEach((person) => {
        if (person.gender_id == 1) {
          this.nbHommes++;
        } else if (person.gender_id == 2) {
          this.nbFemmes++;
        }
      });
      console.log(this.nbHommes);

      this.chartData.datasets[0].data[0] = this.nbHommes;
      this.chartData.datasets[0].data[1] = this.nbFemmes;

      this.dataLoaded = true; // marquer les données comme chargées
    });
  },
  watch: {
    nbHommes: function (newValue, oldValue) {
      this.chartData.datasets[0].data[0] = newValue;
    },
    nbFemmes: function (newValue, oldValue) {
      this.chartData.datasets[0].data[1] = newValue;
    },
  },
};
</script>
