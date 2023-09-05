<template>
  <v-container>
    <h1 class="title">Plan de charge</h1>
    <div>
      <v-row>
        <v-col cols="6" lg="2" md="2">
          <v-text-field
            v-model="researchCollab"
            variant="solo"
            label="Collaborateur"
            bg-color="deep-purple-darken-3"
          >
          </v-text-field>
        </v-col>

        <v-col cols="6" lg="2" md="2">
          <v-select
            label="Année"
            :items="years"
            variant="solo"
            bg-color="red-accent-2"
            v-model="selectedYear"
          ></v-select>
        </v-col>
        <v-col cols="6" lg="2" md="2">
          <v-select
          v-model="selectedManager"
          bg-color="red-accent-2"
          :items="managers"
          clearable
          item-title="full_name"
          item-value="full_name"
          label="Manager"
          variant="solo"
        ></v-select>
        </v-col>
        <v-col cols="6" lg="2" md="2">
          <v-select
            v-model="selectedCustomer"
            variant="solo"
            clearable
            label="Client"
            bg-color="red-accent-2"
            :items="customers"
            item-title="label"
            item-value="label"
          ></v-select>
        </v-col>
        <v-col cols="6" lg="2" md="2">
          <v-select
            v-model="selectedProject"
            variant="solo"
            label="Projet"
            clearable
            bg-color="red-accent-2"
            :items="projects"
            item-title="label"
            item-value="label"
          ></v-select>
        </v-col>
        <v-col cols="12" lg="2" md="2">
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-magnify"
            color="deep-purple-darken-3"
            class="mr-3"
            @click="research"
          >
          </v-btn>
          <v-btn
            size="large"
            rounded="2"
            icon="mdi-close"
            color="deep-purple-lighten-4"
            @click="stopResearch()"
          >
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col>
          <v-btn class="mr-2" color="deep-purple-darken-3"> En mission </v-btn>
          <v-btn class="mr-2" color="deep-purple-lighten-4 ">
            Intercontrat
          </v-btn>
          <v-btn class="mr-2" color="grey-lighten-1 "> Hors SII </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="loading">
        <v-progress-circular
          indeterminate
          color="purple"
         
        ></v-progress-circular>
      </v-row>
      <v-row  v-else class="rounded shadow m-2">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in pdcCalculated" :key="associate.full_name">
              <td>
                <p>
                  {{ associate.full_name }}
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-table class="col-11">
          <thead>
            <tr>
              <th v-for="week in pdc" :key="week.weekNumber">
                <span>
                  {{ week.weekNumber }}
                </span>
              </th>
            </tr>
            <tr>
              <th v-for="week in pdc" :key="week.weekNumber">
                <div>
                  <span class="text-deep-purple-darken-3">
                    {{ week.nbInMission }}
                  </span>
                  /
                  <span class="text-deep-purple-lighten-4">
                    {{ week.nbInterContrat }}</span
                  >
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="associate in pdcCalculated" :key="associate.full_name">
              <td
                id="facture"
                v-for="weekData in pdc"
                :key="weekData.weekNumber"
              >
                <div style="display: flex">
                  <v-btn
                    color="deep-purple-darken-3"
                    v-if="associate.state == 1"
                  ></v-btn>
                  <v-btn
                    color="deep-purple-lighten-4"
                    v-else-if="associate.state == 2"
                  ></v-btn>
                  <v-btn
                    color="grey-lighten-1"
                    v-else-if="associate.state == 3"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-row>
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
export default {
  name: "Pdc",
  data() {
    return {
      value: "",
      researchCollab: null,
      associates: "",
      allAssociates: "",
      currentPage: 1,
      totalPages: 0,
      globalPage: 0,
      loading: true,
      selectedYear: 2023,
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      selectedManager: null,
      managers: [],
      selectedCustomer: null,
      selectedProject: null,
      pdcCalculated: [],
    };
  },

  methods: {
    research() {
      this.loading = true;
      console.log(this.researchCollab);
      Axios.get("pdc", {
        params: {
          year: this.selectedYear,
          collab: this.researchCollab,
        },
      }).then((res) => {
        this.pdc = res.data?.pdc;
        console.log(this.pdc);
        this.pdcCalculated = this.uniqueAssociates();

        this.loading = false;
      });
    },
    // Retourne la date du jour
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    // Donne le format de bdd aux dates
    formatDate(date) {
      const year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      if (month.length < 2) {
        month = "0" + month;
      }
      let day = date.getDate().toString();
      if (day.length < 2) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    },
    // Arrete la recherche et remet le plan de charge à l'original
    stopResearch() {
      this.loading = true;
      Axios.get("pdc", {
        params: {
          year: this.selectedYear,
        },
      }).then((res) => {
        this.pdc = res.data?.pdc;
        this.pdcCalculated = this.uniqueAssociates();
        this.loading = false;
      });
    },
    uniqueAssociates() {
      const uniqueAssociatesMap = new Map();
      this.pdc.forEach((weekData) => {
        weekData.associates.forEach((associate) => {
          if (!uniqueAssociatesMap.has(associate.full_name)) {
            uniqueAssociatesMap.set(associate.full_name, associate);
          }
        });
      });
      return Array.from(uniqueAssociatesMap.values());
    },
  },
  created() {
    this.loading = true;
    Axios.get("pdc", {
      params: {
        year: this.selectedYear,
      },
    }).then((res) => {
      this.pdc = res.data?.pdc;
      this.pdcCalculated = this.uniqueAssociates();
      this.loading = false;
    });
  },

  computed: {
    customers() {
      return this.$store.getters.getCustomers;
    },
    projects() {
      return this.$store.getters.getProjects;
    },
    managers() {
      return this.$store.getters.getManagers;
    },
  },
};
</script>

<style scoped>
p {
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
}
</style>