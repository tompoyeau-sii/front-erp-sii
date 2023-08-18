<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-pencil" color="transparent" elevation="0" v-bind="props">
      </v-btn>
    </template>
    <v-card class="gradient">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-form v-on:submit.prevent="formAddMission">
            <v-card-title>
              <v-row justify="center" class="mt-3">
                <h1 class="form-title">Modifier la mission</h1>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Libelle*"
                      variant="solo"
                      v-model="form.label"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="TJM*"
                      variant="solo"
                      v-model="form.tjm"
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de début*"
                      variant="solo"
                      type="date"
                      v-model="form.start_date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de fin de mission*"
                      variant="solo"
                      v-model="form.end_date"
                      type="date"
                    ></v-text-field>
                  </v-col> -->
                  <v-col cols="12">
                    <v-alert
                      v-if="error != ''"
                      class="mb-5 vibrate"
                      icon="mdi-close"
                      type="error"
                      border
                      :text="error"
                      m-5
                    ></v-alert>
                  </v-col>
                </v-row>
              </v-container>
              <small>*champs obligatoire</small>
            </v-card-text>
          </v-form>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">{{ currentTitle }}</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <table class="table rounded-3 shadow bg-white">
              <thead>
                <tr style="border: white">
                  <th>Mission</th>
                  <th>Date début de la mission</th>
                  <th>Date de fin de la mission</th>
                  <th>Taux d'imputation %</th>
                  <th class="text-red" v-if="this.computedImputation != 100">
                    {{ computedImputation }}
                  </th>
                  <th v-else>{{ computedImputation }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mission in missionFiltered" :key="mission.id">
                  <td>
                    <p v-text="mission.label"></p>
                  </td>
                  <td>
                    <p v-text="formatDate(mission.start_date)"></p>
                  </td>
                  <td>
                    <p v-text="formatDate(mission.end_date)"></p>
                  </td>
                  <td>
                    <v-text-field
                      hide-details="auto"
                      variant="outlined"
                      type="number"
                      v-model="form.old_mission_imputation"
                      min="0"
                      max="100"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p v-text="form.label"></p>
                  </td>
                  <td>
                    <p v-text="formatDate(form.start_date)"></p>
                  </td>
                  <td>
                    <p v-text="formatDate(form.end_date)"></p>
                  </td>
                  <td>
                    <v-text-field
                      hide-details="auto"
                      variant="outlined"
                      type="number"
                      min="0"
                      max="100"
                      v-model="form.new_mission_imputation"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </table>
            <v-col cols="12">
              <v-alert
                v-if="error != ''"
                class="mb-5 vibrate"
                icon="mdi-close"
                type="error"
                border
                :text="error"
                m-5
              ></v-alert>
            </v-col>
            <small>
              Attention le taux d'imputation total des missions doit être égale
              à 100 ! Si il y a 2 missions en même temps, vous définissez
              l'imputation durant les 2 missions. Lorsqu'il restera plus qu'une
              mission, l'imputation de la mission restante passera à 100
              automatiquement.
            </small>
          </v-card-text>
        </v-window-item>
      </v-window>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn v-if="step > 1" variant="text" @click="step--"> Retour </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="white" variant="text" @click="next()">
          Suivant
        </v-btn> -->
        <v-btn
          color="white"
          variant="text"
          type="submit"
          @click="formAddMission()"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "AddMissionForm",
  props: [
    "mission_id",
    "mission_label",
    "mission_start_date",
    "mission_end_date",
    "mission_tjm",
    "mission_project",
  ],
  data() {
    return {
      associate: "",
      form: {
        id: this.mission_id,
        label: this.mission_label,
        tjm: this.mission_tjm,
      },
      customer: this.customer_id,
      dialog: false,
      error: "",
      success: "",
      SuccessState: false,
      snackbar: false,
      associates: [],
      customers: [],
      missions: [],
      missionFiltered: [],
      projects: [],
      projectsFiletred: [],
      step: 1,
      totalImputation: 0,
    };
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Modifier la mission";
        case 2:
          return "Gestion des imputations";
      }
    },
    computedImputation() {
      this.totalImputation =
        parseInt(this.form.new_mission_imputation) +
        parseInt(this.form.old_mission_imputation);
      return (
        parseInt(this.form.new_mission_imputation) +
        parseInt(this.form.old_mission_imputation)
      );
    },
  },
  methods: {
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
    },
    next() {
      if (
        this.form.label != null &&
        this.form.tjm != null &&
        this.form.label != "" &&
        this.form.tjm != ""
      ) {
        if (this.form.start_date < this.form.end_date) {
          this.missionFiltered = this.filteredMissions(
            this.form.start_date,
            this.form.end_date
          );
          if (this.missionFiltered.length == 0) {
            this.step++;
            this.error = "";
            this.form.old_mission_imputation = 0;
            this.form.new_mission_imputation = 100;
          } else if (this.missionFiltered.length == 1) {
            this.step++;
            this.form.old_mission_id = this.missionFiltered
              .map((mission) => mission.id)
              .toString();
            this.form.old_mission_start = this.missionFiltered
              .map((mission) => mission.start_date)
              .toString();
            this.form.old_mission_end = this.missionFiltered
              .map((mission) => mission.end_date)
              .toString();
            this.error = "";
          } else {
            this.error =
              "Vous ne pouvez pas avoir plus de 2 missions en même temps.";
          }
        } else {
          this.error = "La date début doit être inférieur à la date de fin !";
        }
      } else {
        this.error = "Veuillez compléter tous les champs.";
      }
    },
    formAddMission() {
      if (
        this.form.label != null &&
        this.form.tjm != null &&
        this.form.label != "" &&
        this.form.tjm != ""
      ) {
        Axios.post("/mission/update/" + this.form.id, {
          id: this.form.id,
          label: this.form.label,
          tjm: this.form.tjm,
        }).then((response) => {
          console.log("réussi");
          this.dialog = false;
          this.CreateState = false;
          this.SuccessState = true;
          this.success = "Nouvelle mission créée";
          this.error = "";
        });
      } else {
        this.error = "Veuillez compléter tous les champs.";
      }
    },
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
    filteredMissions(newMissionStart, newMissionEnd) {
      const list = [];
      this.missions.forEach((other) => {
        if (
          other.start_date < newMissionStart &&
          other.end_date > newMissionStart
        ) {
          // Si la mission qui va être créer commence pendant une ancienne mission
          list.push(other);
        } else if (
          other.start_date > newMissionStart &&
          other.star_date < newMissionEnd &&
          other.end_date > newMissionEnd
        ) {
          //Si la mission qui va être créer commence avant une autre mission et fini pendant celle-ci
          list.push(other);
        } else if (
          other.start_date > newMissionStart &&
          other.end_date < newMissionEnd
        ) {
          //Si la mission qui va être créer commence avant une autre mission et et fini après
          list.push(other);
        }
      });
      console.log(list);
      return list;
    },
  },
};
</script>
