<template>
  <div class="row">
    <div class="col-4">
      <div class="card shadow border-0 p-3">
        <h5 class="name">Genres</h5>
        <div class="table-responsive">
          <table class="table rounded-3">
            <thead>
              <tr>
                <th>Id</th>
                <th>Libelle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="genre in genders" :key="genre.id">
                <td style="display: flex; align-content: center">
                  <p class="mt-auto mb-auto ml-2" v-text="genre.id"></p>
                </td>
                <td>
                  <p class="mt-auto mb-auto" v-text="genre.label"></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <v-row justify="center">
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
              <v-form v-on:submit.prevent="formAddGenre">
                <v-card-title>
                  <v-row justify="center" class="mt-3">
                    <h1 class="form-title">Ajouter un nouveau genre</h1>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Libelle du genre*"
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
  name: "Genre",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      error: "",
      errorState: false,
      SuccessState: false,
      snackbar: false,
    };
  },
  methods: {
    ...mapActions(["refreshGenders"]),
    formAddGenre: function () {
      if (this.form.label !== "") {
        Axios.post("gender", {
          label: this.form.label,
        }).then(
          (response) => {
            this.form.label = null;
            this.dialog = false;
            this.errorState = false;
            this.SuccessState = true;
            this.success = "Nouveau genre ajouté";
            this.refreshGenders();
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
  },
  computed: {
    genders() {
      return this.$store.getters.getGenders;
    },
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
