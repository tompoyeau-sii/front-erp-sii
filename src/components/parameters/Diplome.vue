<template>
  <div class="row">
    <div class="col-4">
      <div class="card shadow border-0 p-3">
        <h5 class="name">
          Diplômes
          <v-dialog v-model="dialog" width="750px">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-plus"
                variant="text"
                color="deep-purple-darken-1"
                v-bind="props"
              >
              </v-btn>
            </template>

            <v-card class="gradient">
              <v-form v-on:submit.prevent="formAddGraduation">
                <v-card-title>
                  <v-row justify="center" class="mt-3">
                    <h1 class="form-title">Créer un nouveau diplôme</h1>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Libelle du diplôme*"
                          v-model="form.label"
                          variant="solo"
                          required
                        ></v-text-field>
                        <v-alert
                          v-if="errorState == true"
                          class="mb-5"
                          icon="mdi-cancel"
                          type="error"
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
              </v-form>
            </v-card>
          </v-dialog>
        </h5>
        <div class="table-responsive">
          <table class="table rounded-3">
            <tbody v-if="showLess">
              <tr v-for="graduation in graduations.slice(0, 5)" :key="graduation.id">
                <td>
                  <p class="mt-auto mb-auto" v-text="graduation.label"></p>
                </td>
              </tr>
              <tr v-if="graduations.length > 5" align="center" class="text-grey">
                <button @click="showLess = false">+ voir plus ({{ graduations.length - 5 }})</button>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="graduation in graduations" :key="graduation.id">
                <td>
                  <p class="mt-auto mb-auto" v-text="graduation.label"></p>
                </td>
              </tr>
              <tr align="center" class="text-grey">
                <button @click="showLess = true">- voir moins</button>
              </tr>
            </tbody>
          </table>
        </div>

        <v-row justify="center">
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
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import { mapActions } from "vuex";
export default {
  name: "Diplome",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      error: "",
      errorState: false,
      SuccessState: false,
      showLess: true,
      graduations: [],
      snackbar: false,
    };
  },
  methods: {
    ...mapActions(["refreshGraduations"]),
    formAddGraduation: function () {
      if (this.form.label !== "") {
        Axios.post("graduation", {
          label: this.form.label,
        }).then(
          (response) => {
            this.form.label = null;
            this.dialog = false;
            this.errorState = false;
            this.SuccessState = true;
            this.success = "Nouveau diplôme créé";

            // Ajouter la requête pour récupérer la liste mise à jour
            this.fetchData();
          },
          (response) => {
            console.log(response.headers);
            this.errorState = true;
            this.error = response.headers;
          }
        );
      } else {
        this.errorState = true;
        this.error = "Veuillez ajouter un libelle.";
      }
    },
    fetchData() {
      Axios.get("/graduations").then((res) => {
        this.graduations = res.data?.graduation;
      });
      this.refreshGraduations();
    },
  },
  created() {
    Axios.get("/graduations").then((res) => {
      this.graduations = res.data?.graduation;
    });
  },
};
</script>


<style scoped>
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

.card {
  width: 20vh;
  min-width: 200px;
}

.name {
  font-weight: 600;
}
</style>
