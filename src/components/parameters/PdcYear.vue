<template>
  <div class="row">
    <v-col>
      <v-select
        label="Année de référence de l'application"
        v-model="selectedYear"
        :items="years"
        item-title="label"
        item-value="value"
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
      years: [
        { label: "2021 - 2022", value: 2021 },
        { label: "2022 - 2023", valeur: 2022 },
        { label: "2023 - 2024", valeur: 2023},
        { label: "2024 - 2025", valeur: 2024 },
        { label: "2025 - 2026", valeur: 2025 },
        { label: "2026 - 2027", valeur: 2026 },
      ],
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
    fetchPdc() {
      Axios.get("pdc/year").then((res) => {
        this.selectedYear = res.data?.pdc.actual_year;
      });
    },
    updatePdc() {
      Axios.put("pdc/year", {
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
    this.fetchPdc();
  },
};
</script>


<style scoped>
</style>
