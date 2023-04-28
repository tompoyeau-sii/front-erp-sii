<template>
  <div class="container">
    <router-link class="retour" to="/dashboard">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>

    <h1 class="title">Plan de charge</h1>

    <v-progress-circular
      indeterminate
      color="purple"
      v-if="loading"
    ></v-progress-circular>

    <div class="display" v-else>
      <v-row justify="end" class="mb-3">
        <v-btn class="mr-2" color="deep-purple-darken-3"> Facturé </v-btn>
        <v-btn class="mr-2" color="deep-purple-lighten-4 "> Intercontrat </v-btn>
        <!-- <v-btn color="warning"> Absent </v-btn> -->
      </v-row>
      <div class="row">
        <v-table class="col-1">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr v-for="associate in associates" :key="associate.id">
              <th scope="row">
                {{ associate.first_name + " " + associate.name }}
              </th>
            </tr>
          </tbody>
        </v-table>
        <v-table class="col-11">
          <thead>
            <tr>
              <th v-for="week in weeks" :key="week.label">{{ week.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="associate in associates" :key="associate.id">
              <td id="facture" v-for="week in weeks" :key="week.label">
                <div style="display: flex">
                  <v-btn
                    color="deep-purple-darken-3"
                    v-if="isWorking(associate, week)"
                  ></v-btn>
                  <v-btn color="deep-purple-lighten-4" v-else></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
export default {
  name: "Pdc",
  data() {
    return {
      weeks: [],
      associates: "",
      loading: true,
    };
  },
  methods: {
    isWorking(associate, week) {
      for (let mission of associate.Missions) {
        if (mission.start_date < week.end && mission.end_date > week.start) {
          return true;
        }
      }
      return false;
    },
    getWeeksOfYear(year) {
      const date = new Date(year, 0, 1); // 1er janvier de l'année
      const dayOfWeek = date.getDay(); // Jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)

      const firstMondayDate = new Date(
        date.getTime() + ((8 - dayOfWeek) % 7) * 86400000
      ); // Date du 1er lundi de l'année
      if (firstMondayDate.getMonth() < 10) {
        // month = "0"+firstMondayDate.getMonth().toLocaleString()
      }
      const weeks = [
        {
          label: "S1",
          start: format(firstMondayDate, "yyyy-MM-dd"),
          end: format(
            new Date(firstMondayDate.getTime() + 6 * 86400000),
            "yyyy-MM-dd"
          ),
        },
      ]; // Tableau des semaines (initialisé avec la première semaine)
      let currentWeek = 2; // Numéro de la semaine courante (commence à 2 car la première semaine est déjà dans le tableau)
      let currentDate = new Date(firstMondayDate.getTime() + 7 * 86400000); // Date du lundi de la deuxième semaine
      while (currentDate.getFullYear() === year) {
        // Tant que la date courante est dans l'année demandée
        const startOfWeek = currentDate;
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 86400000);
        weeks.push({
          label: "S" + currentWeek,
          start: format(startOfWeek, "yyyy-MM-dd"),
          end: format(endOfWeek, "yyyy-MM-dd"),
        }); // Ajoute la semaine courante au tableau
        currentWeek++; // Passe à la semaine suivante
        currentDate = new Date(currentDate.getTime() + 7 * 86400000); // Passe à la date du lundi de la semaine suivante
      }
      return weeks;
    },
  },
  created() {
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
      this.loading = false;
    });
    console.log(this.test);

    this.weeks = this.getWeeksOfYear(2023);

    console.log(this.weeks);
    console.log(this.pdc);
  },
};
</script>

<style scoped>
.associate {
  position: fixed;
  background-color: white;
  z-index: 1;
  max-width: 100px;
  min-width: 100px;
}
.facture {
  border-radius: 5px;
  width: 10px;
  height: 10px;
  background-color: forestgreen;
}
.intercontrat {
  border-radius: 10px;
  width: 10px;
  height: 10px;
  background-color: darkred;
}
.collab {
  overflow: hidden;
}
</style>