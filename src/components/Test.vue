<template>
  <div>
    <v-text-field clearable label="Label" variant="solo"></v-text-field>

    <!-- Affichage de vos données paginées -->
    <ul>
      <li v-for="associate in associates" :key="associate.id">
        {{ associate.name }}
      </li>
    </ul>

    <!-- Barre de pagination Vuetify -->
    <v-pagination v-model="currentPage" :length="totalPages" @input="fetchData"></v-pagination> 
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";

export default {
  name: "test",
  data() {
    return {
      associates: [],
      currentPage: 1,
      totalPages: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    currentPage(newPage) {
      this.fetchData(newPage);
    },
  },
  methods: {
    async fetchData(page) {
      const response = await Axios.get(`/associates?page=${page || this.currentPage}`);
      console.log(response)
      this.associates = response.data.associate;
      this.totalPages = response.data.totalPages;
    },
  },
};
</script>

<style>
</style>