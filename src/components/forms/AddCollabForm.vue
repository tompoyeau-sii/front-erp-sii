<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus"
          color="deep-purple-darken-3"
          v-bind="props"
        >
          Ajouter un collaborateur
        </v-btn>
      </template>
      <v-card>
        <v-form v-on:submit.prevent="formAddCollab">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Ajouter un nouveau collaborateur</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Prenom*"
                    v-model="form.first_name"
                    required
                    variant="solo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nom*"
                    variant="solo"
                    v-model="form.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-radio-group inline label="Genre" v-model="form.sexe">
                    <v-radio label="Homme" :value="1"></v-radio>
                    <v-radio label="Femme" :value="2"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="form.graduation"
                    :items="graduations"
                    item-title="label"
                    item-value="id"
                    label="Diplôme"
                    variant="solo"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Date de naissance*"
                    variant="solo"
                    type="date"
                    v-model="form.birthdate"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="form.job"
                    :items="jobs"
                    item-title="label"
                    item-value="id"
                    label="Poste"
                    variant="solo"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    variant="solo"
                    v-model="computedMail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Date d'embauche*"
                    variant="solo"
                    type="date"
                    v-model="form.start_date"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="PRU*"
                    variant="solo"
                    v-model="form.pru"
                    type=""
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-checkbox
                    v-model="form.isTutor"
                    label="est un Tuteur"
                    value="true"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-checkbox
                    v-model="form.isManager"
                    label="est un Manager"
                    value="true"
                    hide-details
                  ></v-checkbox>
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
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "AddCollabForm",
  data() {
    return {
      form: {
        name: "",
        first_name: "",
        sexe: "",
        graduation: "",
        birthdate: "",
        job: "",
        start_date: "",
        pru: "",
        isManager: null,
        isTutor: null,
      },
      dialog: false,
      success: "",
      jobs: [],
      graduations: [],
      error: "",
    };
  },

  computed: {
    computedMail() {
      return this.form.first_name.toLowerCase() + "." + this.form.name.toLowerCase() + "@sii.fr";
    },
  },

  methods: {
    formAddCollab: function () {
      if (
        this.form.first_name != "" &&
        this.form.name != "" &&
        this.form.sexe != "" &&
        this.form.graduation != "" &&
        this.form.job != "" &&
        this.form.birthdate != "" &&
        this.form.mail != "" &&
        this.form.start_date != "" &&
        this.form.pru != ""
      ) {
        Axios.post("/associate", {
          name: this.form.name,
          first_name: this.form.first_name,
          gender: this.form.sexe,
          graduation_id: this.form.graduation,
          job_id: this.form.job,
          birthdate: this.form.birthdate,
          start_date: this.form.start_date,
          mail: this.form.mail,
          pru: this.form.pru,
          isTutor: this.form.isTutor,
          isManager: this.form.isManager,
        })
          .then((response) => {
            console.log(response);
            this.dialog = false;
            this.SuccessState = true;
            this.error = "";
            this.success = "Nouveau collaborateurs ajouté.";
            this.refresh();
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        this.error = "Tous les champs sont obligatoires.";
      }
    },
  },
  created() {
    Axios.get("/jobs").then((res) => {
      this.jobs = res.data?.job;
    });
    Axios.get("/graduations").then((res) => {
      this.graduations = res.data?.graduation;
    });
  },
};
</script>

<style>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
  border-style: none;
}

.v-card {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>