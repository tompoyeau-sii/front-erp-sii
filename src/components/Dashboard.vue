<template>
  <v-container>
    <h1 class="title mt-3 mb-5">Tableau de bord</h1>
    <v-row>
      <v-col cols="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Total de collaborateurs SII Le Mans</p>
          <v-row justify="end">
            <v-col>
              <v-icon class="title" icon="mdi-account-group" size="x-large"></v-icon>
            </v-col>
            <v-col>
              <p class="data m-2" v-text="associates.length"></p>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Chiffres d'affaires SII Le Mans</p>
          <v-row justify="end">
            
            <v-icon class="title" icon="mdi-currency-eur" size="x-large"></v-icon>
            <p class="data m-2">104</p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="shadow rounded-5 p-4">
          <p class="etiquette mb-2">Évolution du chiffre d'affaires</p>
          <v-row justify="end">
            <v-icon class="title" icon="mdi-finance" size="x-large"></v-icon>
            <p class="data m-2">104</p>
            
          </v-row>
        </div>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: 'dashboard',
  data() {
    return {
      associates: [],
    }
  },
  created() {
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
    });
  }
  }
</script>

<style scoped>
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