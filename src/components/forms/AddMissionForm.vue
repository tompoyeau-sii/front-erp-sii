<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        prepend-icon="mdi-plus"
        color="deep-purple-darken-3"
        v-bind="props"
      >
        Création d'une nouvelle mission
      </v-btn>
    </template>
    <v-card class="gradient">
      <!-- <v-form v-on:submit.prevent="formAddMission">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1 class="form-title">Création d'une nouvelle mission</h1>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="form.associate"
                  :items="associates"
                  item-title="name"
                  item-value="id"
                  :label="title"
                  variant="solo"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="form.customer"
                  :items="customers"
                  item-title="label"
                  item-value="id"
                  label="Client*"
                  variant="solo"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="form.project"
                  :items="projects"
                  item-title="label"
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
                  label="Date de fin de mission"
                  variant="solo"
                  v-model="form.end_date"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Imputation"
                  variant="solo"
                  v-model="form.imputation"
                  type="integer"
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" variant="text" @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn color="white" variant="text" type="submit">
            Bienvenue !
          </v-btn>
        </v-card-actions>
      </v-form> -->
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
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.collab"
                      :items="associates"
                      item-title="name"
                      item-value="id"
                      label="Collaborateur"
                      variant="solo"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.customer"
                      :items="customers"
                      item-title="label"
                      item-value="id"
                      label="Client"
                      variant="solo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.project"
                      :items="projects"
                      item-title="label"
                      item-value="id"
                      label="Projet"
                      variant="solo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de début de la mission*"
                      variant="solo"
                      type="date"
                      v-model="form.start_date"
                      required
                    ></v-text-field>
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
                      label="Imputation*"
                      variant="solo"
                      v-model="form.imputation"
                      required
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
                  <th>Taux d'imputation</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mission in missions" :key="mission.id">
                  <td v-if="mission.Imputations.map((imputation) => imputation.end_date) >= this.todayDate()">
                    <p v-text="'Ma mission'"></p>
                  </td>
                  <td>
                    <p v-text="'1'"></p>
                  </td>
                </tr>
              </tbody>
            </table>
            <small>*champs obligatoire</small>
          </v-card-text>
        </v-window-item>
      </v-window> 
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn v-if="step > 1" variant="text" @click="step--"> Retour </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="white" variant="text" @click="step++">
          Suivant
        </v-btn>
        <v-btn
          v-else
          color="white"
          variant="text"
          type="submit"
          @click="(dialog = false), (step = 0)"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
export default {
  name: "AddMissionForm",
  props: ["title"],
  data() {
    return {
      form: {
        associate: "",
        customer: "",
        project: "",
        start_date: "",
        tjm: "",
        imputation: "",
        end_date: null,
      },
      dialog: false,
      error: "",
      projects: [],
      SuccessState: false,
      snackbar: false,
      associates: [],
      customers: [],
      step: 1,
    };
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
  },
  created() {
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
    });
  },
  methods: {
    formAddMission: function () {
      if (
        this.form.associate !== "" &&
        this.form.customer !== "" &&
        this.form.project !== "" &&
        this.form.start_date !== "" &&
        this.form.tjm !== "" &&
        this.form.imputation !== ""
      ) {
        Axios.post("/mission", {
          associate_id: this.form.associate,
          project_id: this.form.project,
          start_date: this.form.start_date,
          tjm: this.form.tjm,
          imputation: this.form.imputation,
          end_date: this.form.end_date,
        }).then(
          (response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Nouvelle mission créée";
            this.error = "";
          },
          (response) => {
            this.SuccessState = false;
            console.log(response);
          }
        );
      } else {
        this.error = "Veuillez compléter tous les champs.";
      }
    },
    todayDate() {
      console.log(format(new Date(), "yyyy/MM/dd"));
      return format(new Date(), "yyyy/MM/dd");
    },
  },
};
</script>

<style>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>