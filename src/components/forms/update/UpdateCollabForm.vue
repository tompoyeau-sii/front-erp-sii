<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-pencil" color="deep-purple-darken-1" v-bind="props">
        </v-btn>
      </template>
      <v-card>
        <v-form v-on:submit.prevent="formUpdateCollab">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Modifier le collaborateur</h1>
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
                  <v-radio-group inline label="Genre" v-model="form.gender">
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
                <v-col cols="12">
                  <v-autocomplete
                    v-model="form.manager"
                    :items="managers"
                    item-title="full_name"
                    item-value="id"
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
            <v-btn color="white" variant="text" type="submit"> Modifier </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
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
export default {
  name: "UpdateCollabForm",
  props: [
    "associate_id",
    "associate_name",
    "associate_first_name",
    "associate_birthdate",
    "associate_mail",
    "associate_start_date",
    "associate_pru",
    "associate_graduation",
    "associate_job",
    "associate_job_id",
    "associate_gender",
    "associate_manager",
    "associate_manager_id",
  ],
  data() {
    return {
      associate: [],
      form: {
        name: this.associate_name,
        first_name: this.associate_first_name,
        birthdate: this.associate_birthdate,
        gender: this.associate_gender,
        graduation: this.associate_graduation,
        job: this.associate_job_id,
        start_date: this.associate_start_date,
        pru: this.associate_pru,
        mail: this.associate_mail,
        manager: this.associate_manager_id,
      },
      dialog: false,
      success: "",
      error: "",
      SuccessState: false,
      snackbar: false,
    };
  },

  computed: {
    computedMail() {
      let first_name = this.form.first_name.toLowerCase();
      first_name = first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let name = this.form.name.toLowerCase();
      name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

  methods: {
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
    formUpdateCollab() {
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
        if (
          (this.form.manager == null && this.form.job == 1) ||
          this.form.manager != null
        ) {
          Axios.put("/associate/update/" + this.associate_id, {
            name: this.form.name,
            first_name: this.form.first_name,
            gender: this.form.sexe,
            graduation_id: this.form.graduation,
            job_id: this.form.job,
            birthdate: this.form.birthdate,
            start_date: this.form.start_date,
            mail: this.form.mail,
            pru: this.form.pru,
            manager_id: this.form.manager,
          })
            .then((response) => {
              console.log(response);
              this.dialog = false;
              this.SuccessState = true;
              this.error = "";
              this.success = "Collaborateur modifié.";
              this.$emit("associateUpdated");
              this.snackbar = true;
            })
            .catch((err) => {
              console.log(err);
              this.error = err.response.data.error;
            });
        }
      } else {
        this.error = "Tous les champs sont obligatoires.";
      }
    },
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

.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}

.v-card {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>