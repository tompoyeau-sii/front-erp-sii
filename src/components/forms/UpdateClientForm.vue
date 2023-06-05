<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-pencil"
          color="deep-purple-darken-3"
          v-bind="props"
        />
      </template>
      <v-card class="gradient">
        <v-form fast-fail @submit.prevent v-on:submit.prevent="formUpdateCustomer">
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
                    :rules="labelRules"
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
      labelRules: [
        value => {
          if (value?.length > 2) return true
          return 'Le label doit au moins faire 3 caractères.'
        },
      ],
      dialog: false,
      error: "",
      SuccessState: false,
      snackbar: false,
    };
  },
  methods: {
    formUpdateCustomer() {
      if (this.form.label !== "") {
        Axios
          .post("/customer/update/" + this.customer_id, {
            label: this.form.label,
          })
          .then(
            (response) => {
              this.dialog = false;
              this.CreateState = false;
              this.SuccessState = true;
              this.success = "Client modifié";
              this.error = "";
            },
            (response) => {
              this.SuccessState = false;
              console.log(response);
              this.error = response.data;
              console.log("erreur : " + this.error);
            }
          );
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
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}

.client {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  /* background: linear-gradient(135deg, #0FF0B3 0%, #036ED9 100%);
  background: linear-gradient(135deg, #65799B 0%, #5E2563 100%); */
  color: white;
  width: 20vh;
  min-width: 200px;
}

.name {
  font-weight: 600;
}
</style>