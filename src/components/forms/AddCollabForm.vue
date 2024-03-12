<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus"
          color="deep-purple-darken-1"
          v-bind="props"
        >
          Collaborateur
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
                    transition="scroll-x-reverse-transition"
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
                <v-col cols="12">
                  <v-autocomplete
                    v-model="form.manager"
                    :items="managers"
                    item-title="full_name"
                    item-value="id"
                    clearable
                    label="Manager"
                    variant="solo"
                  ></v-autocomplete>
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
            <v-btn
              color="white"
              variant="text"
              type="submit"
              @click="snackbar = true"
            >
              Bienvenue !
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
  </v-row>
</template>

<script>
import Axios from "@/_services/caller.service";
import { format } from "date-fns";
export default {
  name: "AddCollabForm",
  data() {
    return {
      form: {
        name: "",
        first_name: "",
        sexe: "",
        graduation: null,
        birthdate: "",
        job: null,
        start_date: "",
        pru: "",
        manager: null,
      },
      dialog: false,
      success: "",
      SuccessState: false,
      error: "",
    };
  },

  methods: {
    todayDate() {
      return format(new Date(), "yyyy-MM-dd");
    },
    formAddCollab() {
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
        if (this.form.manager == null && this.form.job != 1) {
          this.error = "Veuillez sélectioner un manager.";
        } else if (this.form.manager != null && this.form.job == 1) {
          this.error = "Un manager ne peux pas avoir de manager.";
        } else if (
          (this.form.manager == null && this.form.job == 1) ||
          (this.form.manager != null && this.form.job != 1)
        ) {
          Axios.post("/associate", {
            name: this.form.name,
            first_name: this.form.first_name,
            gender: this.form.sexe,
            graduation_id: this.form.graduation,
            job_id: this.form.job,
            birthdate: this.form.birthdate,
            start_date: this.form.start_date,
            mail: this.computedMail,
            pru: this.form.pru,
            manager_id: this.form.manager,
          })
            .then((response) => {
              console.log(response);

              // Mise à jour de la propriété associates avec l'appel API à "/associates"
              Axios.get("/associates")
                .then((associatesResponse) => {
                  this.$store.commit("setAssociates", associatesResponse.data);
                })
                .catch((associatesError) => {
                  console.error(
                    "Erreur lors de la mise à jour des associés :",
                    associatesError
                  );
                });

                this.$emit('associateAdded');
              this.dialog = false;
              this.CreateState = false;
              this.SuccessState = true;
              this.success = "Nouveau collaborateur ajouté.";
              this.error = "";
            })
            .catch((err) => {
              console.log(err);
              this.error = err.response.data.error;
            });
        } else {
          this.error = "Veuillez sélectioner un manager.";
        }
      } else {
        this.error = "Tous les champs sont obligatoires.";
      }
    },
  },

  computed: {
    computedMail() {
      let first_name = this.form.first_name.toLowerCase();
      first_name = first_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");

      let name = this.form.name.toLowerCase();
      name = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");

      return first_name + "." + name + "@sii.fr";
    },

    jobs() {
      return this.$store.getters.getJobs;
    },
    graduations() {
      return this.$store.getters.getGraduations;
    },
    managers() {
      return this.$store.getters.getManagers;
    },
  },
};
</script>

<style typ>
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