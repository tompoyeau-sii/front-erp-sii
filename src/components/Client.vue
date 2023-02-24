<template>
  <div class="container">
    <h1 class="pt-3 pb-3 title">Clients SII Le Mans</h1>
    <v-row justify="end">
      <v-dialog v-model="dialog" width="750px">
        <template v-slot:activator="{ props }">
          <v-btn prepend-icon="mdi-plus" color="success" v-bind="props">
            Ajouter un client
          </v-btn>
        </template>
        <v-card style="background: linear-gradient(135deg, #75519b 0%, #e84654 100%);color: white;">
          <v-form v-on:submit.prevent="formAddCustomer">
            <v-card-title>
              <v-row justify="center" class="mt-3">
                <h1>Ajouter un nouveau client</h1>
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
                @click="dialog = false"
              >
                Annuler
              </v-btn>
              <v-btn
                prepend-icon="mdi-check-bold"
                color="white"
                type="submit"
                @click="snackbar = true"
              >
                Créer
              </v-btn>
            </v-card-actions>
            <v-snackbar v-if='state != "" ' v-model="snackbar" color="red-darken-2" timeout="5000">
              {{ state }}
            </v-snackbar>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>

    <div class="row">
      <div
        class="col-2 client rounded-3 m-2 shadow-sm"
        v-for="customer in customers"
        :key="customer.id"
      >
        <p v-text="customer.label"></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Client",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      customers: [],
      state: "",
      snackbar: false,
    };
  },
  methods: {
    formAddCustomer: function () {
      if (this.form.label !== "") {
        axios
          .post("http://localhost:8080/api/customer", {
            label: this.form.label,
          })
          .then(
            (response) => {
              console.log(response);
              this.dialog = false;
              this.state = "";
            },
            (error, response) => {
              console.log(response);
            }
          );
      } else {
        this.state = "Vous devez au moins ajouter un libelle.";
      }
    },
  },
  created() {
    axios.get("http://localhost:8080/api/customer").then((res) => {
      this.customers = res.data?.customer;
    });
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}

.client {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  color: white;
}
</style>
