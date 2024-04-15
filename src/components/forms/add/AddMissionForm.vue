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
      <v-form v-on:submit.prevent="formAddMission">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1 class="form-title">Créer une nouvelle mission</h1>
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
                  v-if="customer_id == null"
                  v-model="customer"
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
                  label="Date de fin de mission"
                  variant="solo"
                  v-model="form.end_date"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col v-if="error != ''" cols="12">
                <v-alert
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
          <v-btn color="white" variant="text" type="submit">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-form>
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
import { format, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "AddMissionForm",
  props: [
    "associate_id",
    "customer_id",
    "associate_start_date",
    "associate_end_date",
  ],
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
    },
  },
  methods: {
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
    },
    formatDateBDD(date) {
      return (date = format(new Date(date), "yyyy-MM-dd"));
    },
    formAddMission() {
      if (
        this.form.label !== null &&
        this.form.associate !== null &&
        this.form.project !== null &&
        this.form.start_date !== null &&
        this.form.tjm !== null
      ) {

        if(this.form.end_date == null) {
          this.form.end_date = "2099-12-30"
        }

        var start_date = this.formatDateBDD(this.form.start_date);
        var end_date = this.formatDateBDD(this.form.end_date);
        Axios.post("/mission", {
          label: this.form.label,
          associate_id: this.form.associate,
          project_id: this.form.project,
          tjm: this.form.tjm,
          start_date: start_date,
          end_date: end_date,
        })
          .then((response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Nouvelle mission créée";
            this.snackbar = true;
            this.error = "";
            this.$emit("associateUpdated");
            this.$emit("customerUpdated");
            console.log(response);
          })
          .catch((err) => {
            this.error = err.response.data.error;
            console.log(err);
          });
      } else {
        this.error = "Veuillez compléter tous les champs.";
      }
    },
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
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
      Axios.get("/associate/" + this.associate_id).then((res) => {
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