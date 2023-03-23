<template>
  <div class="container">
    <router-link class="retour" to="/dashboard">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>

    <h1 class="title">Plan de charge</h1>

    <v-table>
      <thead>
        <tr>
          <th></th>
          <th v-for="week in weeks" :key="week.label">{{ week.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="associate in associates" :key="associate.id">
          <th class="" scope="row">{{ associate.first_name + " " + associate.name }}</th>
          <td id="facture" v-for="week in weeks" :key="week.label">
            <v-btn
              color="success"
              v-if="isFactured(associate.Missions, week.start) == true"
            >
            </v-btn>
            <v-btn color="error" v-else></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="end" class="mt-3">
      <v-btn class="mr-2" color="success"> Facturé </v-btn>
      <v-btn class="mr-2" color="error"> Intercontrat </v-btn>
      <!-- <v-btn color="warning"> Absent </v-btn> -->
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { format, isBefore, parseISO } from "date-fns";
export default {
  name: "Pdc",
  data() {
    return {
      weeks: [],
      associates: "",
      test: parseISO("9999-12-31"),
    };
  },
  methods: {
    isFactured(missions, startDate) {
      if (missions.length === 0) {
        console.log("Pas array");
        return false;
      }
      var missionStart = missions[0].start_date;
      var missionEnd = missions[0].end_date;

      for (var i = 0; i < missions.length; i++) {
        console.log("je rentre dans le for");
        if (missions[i].start_date < missionStart) {
          console.log("je rentre dans le 1er if");
          missionStart = missions[i].start_date;
        }
        if (missions[i].end_date > missionEnd) {
          console.log("Changement de la date de fin de mission !");
          missionEnd = missions[i].end_date;
        }
      }
      startDate = startDate.toString();

      missionStart = parseISO(missionStart);
      missionEnd = parseISO(missionEnd);
      startDate = parseISO(startDate);
      /*Permet de dire si la mission est déjà temriné*/
      const isEnd = isBefore(missionEnd, startDate);

      /*Permet de savoir si la mission à déjà commencé*/
      const isStarted = isBefore(missionStart, startDate);

      /*Cas ou la mission c'est déjà terminé*/
      if (isEnd) {
        console.log("MissionStart isEnd : " + missionStart);
        console.log("MissionEnd isEnd : " + missionEnd);
        console.log("startDate isEnd : " + startDate);
        console.log(false);
        return false;
      }

      /*Cas ou la mission a commencé et n'est pas terminé*/
      if (isStarted && isEnd == false) {
        console.log("MissionStart isStarted : " + missionStart);
        console.log("missionEnd isStarted : " + missionEnd);
        console.log("startDate isStarted : " + startDate);
        console.log(true);
        return true;
      }
    },
  },
  created() {
    axios.get("http://localhost:8080/api/associates").then((res) => {
      this.associates = res.data?.associate;
      console.log(this.associates);
    });
    console.log(this.test);

    function getWeeksOfYear(year) {
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
    }
    this.weeks = getWeeksOfYear(2023);

    // function state() {
    //   /* Evaluation de l'état */

    //   axios.get("http://localhost:8080/api/associates").then((res) => {
    //   const associates = res.data?.associate;
    //   return associates
    //   })

    //   const weeks =  getWeeksOfYear(2023);
    //   weeks.forEach((week) => {
    //     associates.forEach((asso) => {
    //       asso.Missions.forEach((mission) => {
    //         if (
    //           mission.start_date >= week.start &&
    //           mission.start_date <= week.end
    //         ) {
    //           if (mission.end_date != null) {
    //             console.log("Pas de end date")
    //           } else if (
    //             mission.end_date <= week.start &&
    //             mission.end_date >= week.end
    //           ) {
    //             console.log("facturé")
    //           }
    //         }
    //       });
    //     });
    //   });
    // }

    // this.temp = state();

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
</style>