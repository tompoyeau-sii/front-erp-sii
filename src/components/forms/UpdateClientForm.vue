<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-pencil" color="deep-purple-darken-1" v-bind="props" />
      </template>
      <v-card class="gradient">
        <v-form
          fast-fail
          @submit.prevent
          v-on:submit.prevent="formUpdateCustomer"
        >
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Modifier un client</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Libelle d'entreprise*"
                    v-model="form.label"
                    variant="solo"
                    required
                  ></v-text-field>
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
            <v-btn
              prepend-icon="mdi-window-close"
              color="white"
              @click="(dialog = false), (error = '')"
            >
              Annuler
            </v-btn>
            <v-btn
              prepend-icon="mdi-check-bold"
              color="white"
              type="submit"
              @click="snackbar = true"
            >
              Modifier
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
export default {
  name: "UpdateClientForm",
  props: ["customer", "customer_id"],
  data() {
    return {
      form: {
        label: this.customer,
      },
      dialog: false,
      error: "",
      SuccessState: false,
      snackbar: false,
    };
  },
  methods: {
    formUpdateCustomer() {
      if (this.form.label !== "" || this.form.label !== null) {
        console.log(this.form.label)
        Axios.post("/customer/update/" + this.customer_id, {
          label: this.form.label,
        })
          .then((response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Client modifié";
            this.error = "";
          })
          .catch((err) => {
            this.error = err.response.data.error;
            this.SuccessState = false;
          });
      } else {
        this.error = "Veuillez ajouter un libelle.";
      }
    },
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}

.name {
  font-weight: 600;
}
</style>