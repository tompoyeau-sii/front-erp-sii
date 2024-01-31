<template>
  <div class="row">
    <v-col>
      <v-select
        label="Année de référence du plan de charge"
        v-model="selectedYear"
        :items="years"
        variant="solo"
      ></v-select>
    </v-col>
    <v-col>
      <v-btn
        icon="mdi-check"
        @click="updatePdc()"
        color="deep-purple-darken-1"
      ></v-btn>
    </v-col>
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
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";

export default {
  name: "PdcYear",
  data() {
    return {
      years: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
      selectedYear: null,
      dialog: false,
      error: "",
      errorState: false,
      SuccessState: false,
      snackbar: false,
      success: 'Oui'
    };
  },
  methods: {
    fetchPdc: function () {
      Axios.get("http://localhost:8080/api/pdc/year").then((res) => {
        this.selectedYear = res.data?.pdc.actual_year;
      });
    },
    updatePdc: function () {
      Axios.post("http://localhost:8080/api/pdc/year", {
        year: this.selectedYear,
      }).then((response) => {
        console.log(response.data.message);
        this.SuccessState = true;
        this.snackbar =  true,
        this.success = response.data.message;
      });
    },
  },
  created() {
    // Appeler la méthode pour récupérer la liste des diplômes au chargement initial
    this.fetchPdc();
  },
};
</script>


<style scoped>
</style>
