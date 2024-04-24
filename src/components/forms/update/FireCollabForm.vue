<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-account-arrow-right"
          color="red-accent-2"
          v-bind="props"
        >
        </v-btn>
      </template>
      <v-card>
        <v-form v-on:submit.prevent="formFireCollab">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Départ du collaborateur</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-vol cols="12">
                  <p>
                    Dans le cas du départ d'un collaborateur, vous devez
                    modifier manuellement la date de fin de sa ou de ses
                    missions en cours ou à venir. La gestion du PRU et des
                    autres relations est faite automatiquement.
                  </p>
                </v-vol>
                <v-col cols="12">
                  <v-text-field
                    label="Date de départ*"
                    variant="solo"
                    type="date"
                    v-model="form.end_date"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" variant="text" @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn color="white" variant="text" type="submit">
              Au revoir
            </v-btn>
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
export default {
  name: "FireCollabForm",
  props: ["associate_id"],
  data() {
    return {
      associate: [],
      form: {
        end_date: null,
      },
      dialog: false,
      success: "",
      error: "",
      SuccessState: false,
      snackbar: false,
    };
  },

  methods: {
    formFireCollab() {
      if (this.form.end_date != "") {
        Axios.put("/associate/fire/" + this.associate_id, {
          end_date: this.form.end_date,
        })
          .then((response) => {
            console.log(response);
            this.dialog = false;
            this.SuccessState = true;
            this.error = "";
            this.success = "Départ du collaborateur planifié.";
            this.$emit("associateUpdated");
            this.snackbar = true;
          })
          .catch((err) => {
            console.log(err);
            this.error = err.response.data.error;
          });
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