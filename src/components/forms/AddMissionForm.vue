<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        prepend-icon="mdi-plus"
        color="deep-purple-darken-1"
        variant="outlined"
        stacked
        style="height: auto"
        v-bind="props"
      >
        Création d'une nouvelle mission
      </v-btn>
    </template>
    <v-card class="gradient">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-form v-on:submit.prevent="formAddMission">
            <v-card-title>
              <v-row justify="center" class="mt-3">
                <h1 class="form-title">{{ currentTitle }}</h1>
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
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-if="associate_id == null"
                      v-model="form.associate"
                      :items="associates"
                      item-title="full_name"
                      item-value="id"
                      label="Collaborateur*"
                      variant="solo"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-else
                      v-model="form.associate"
                      :item-title="associate"
                      disabled
                      label="Collaborateur*"
                      variant="solo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-if="customer_id == null"
                      v-model="customer"
                      :items="customers"
                      item-title="label"
                      item-value="id"
                      label="Client*"
                      variant="solo"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-else
                      v-model="customer"
                      :items="customers"
                      disabled
                      label="Client*"
                      variant="solo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.project"
                      :items="projectsFiletred"
                      item-title="label_adv"
                      item-value="id"
                      label="Projects*"
                      variant="solo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="TJM*"
                      variant="solo"
                      v-model="form.tjm"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                  </v-col>
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
        <v-btn v-if="step > 1" variant="text" @click="step--"> Retour </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="white" variant="text" @click="next()">
          Suivant
        </v-btn>
        <v-btn
          v-else
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
  props: ["associate_id", "customer_id"],
  data() {
    return {
      associate: "",
      form: {
        label: null,
        associate: this.associate_id,
        project: null,
        tjm: null,
        imputation: null,
        start_date: null,
        end_date: null,
        old_mission_id: null,
        old_mission_start: null,
        old_mission_end: null,
        old_mission_imputation: 50,
        new_mission_imputation: 50,
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
  watch: {
    customer(n, o) {
      this.projectsFiletred = [];
      this.projects.forEach((project) => {
        // Vérifie si l'ID du projet correspond à l'ID spécifié
        if (project.customer_id === n) {
          // Ajoute le projet correspondant à l'ID spécifié au tableau filtré
          project.label_adv = project.label + " - " + project.adv;
          this.projectsFiletred.push(project);
        }
      });
      console.log(this.projectsFiletred);
    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Créer une nouvelle mission";
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
    formAddMission() {
      if (
        this.form.label !== "" &&
        this.form.associate !== "" &&
        this.form.project !== "" &&
        this.form.start_date !== "" &&
        this.form.end_date !== "" &&
        this.form.tjm !== "" &&
        this.totalImputation == 100
      ) {
        Axios.post("/mission", {
          label: this.form.label,
          associate_id: this.form.associate,
          project_id: this.form.project,
          tjm: this.form.tjm,
          start_date: this.form.start_date,
          end_date: this.form.end_date,
          old_mission_id: this.form.old_mission_id,
          old_mission_start: this.form.old_mission_start,
          old_mission_end: this.form.old_mission_end,
          old_mission_imputation: this.form.old_mission_imputation,
          new_mission_imputation: this.form.new_mission_imputation,
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
        console.log("otherStart: " + other.start_date);
        console.log("newStart: " + newMissionStart);
        console.log("otherEnd: " + other.end_date);
        console.log("newEnd: " + newMissionEnd);
        if (
          other.start_date < newMissionStart &&
          other.end_date > newMissionStart
        ) {
          // Si la mission qui va être créer commence pendant une ancienne mission
          list.push(other);
          console.log(
            "Si la mission qui va être créer commence pendant une ancienne mission"
          );
        } else if (
          other.start_date > newMissionStart &&
          other.star_date < newMissionEnd &&
          other.end_date > newMissionEnd
        ) {
          //Si la mission qui va être créer commence avant une autre mission et fini pendant celle-ci
          console.log(
            "Si la mission qui va être créer commence avant une autre mission et fini pendant celle-ci"
          );
          list.push(other);
        } else if (
          other.start_date > newMissionStart &&
          other.end_date < newMissionEnd
        ) {
          //Si la mission qui va être créer commence avant une autre mission et et fini après
          list.push(other);
          console.log(
            "Si la mission qui va être créer commence avant une autre mission et et fini après"
          );
        }
      });
      console.log(list);
      return list;
    },
    next() {
      if (
        this.form.label != null &&
        this.form.associate != "" &&
        this.form.project != null &&
        this.form.start_date != null &&
        this.form.end_date != null &&
        this.form.tjm != null
      ) {
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
        this.error = "Veuillez compléter tous les champs.";
      }
    },
  },
  created() {
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
      if (this.customer_id) {
        this.projects.forEach((project) => {
          if (project.customer_id == this.customer_id) {
            // Ajoute le projet correspondant à l'ID spécifié au tableau filtré
            project.label_adv = project.label + " - " + project.adv;
            this.projectsFiletred.push(project);
          }
        });
      }
    });
    Axios.get("/associates").then((res) => {
      res.data?.associate.forEach((associate) => {
        associate.full_name = associate.first_name + " " + associate.name;
        this.associates.push(associate);
      });
    });
    if (this.associate_id) {
      Axios.get("/associate/" + this.form.associate).then((res) => {
        this.missions = res.data?.Missions;
      });
    }
  },
};
</script>

<style>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>