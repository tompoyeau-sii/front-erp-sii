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
        <v-card class="gradient">
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
            <v-snackbar
              v-if="CreateState == true"
              v-model="snackbar"
              w-auto
              color="red-darken-2"
              timeout="5000"
            >
              <v-icon start icon="mdi-cancel"></v-icon>
              {{ error }}
            </v-snackbar>
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

    <div class="row">
      <router-link
        class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
        v-for="customer in customers"
        :key="customer.id"
        :to="{ name: 'FicheClientView', params: { label: customer.label } }"
      >
        <div>
          <p class="text-h5 name" v-text="customer.label"></p>
          <p>100 000€</p>
          <p>6 collaborateurs</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "Client",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      customers: [],
      CreateState: false,
      SuccessState: false,
      snackbar: false,
      test: this.$store.getters.getToken,
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
              this.dialog = false;
              this.CreateState = false;
              this.SuccessState = true;
              this.success = "Nouveau client créé";
            },
            (response) => {
              this.CreateState = true;
              this.error = response.headers;
            }
          );
      } else {
        this.CreateState = true;
        this.error = "Veuillez ajouter un libelle.";
      }
    },
  },
  created() {
    axios.get("http://localhost:8080/api/customers").then((res) => {
      this.customers = res.data?.customer;
    });
  },
  computed: {
    ...mapGetters(["getToken"]),
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
