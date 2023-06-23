<template>
    <div class="row">
      <div class="col-4">
        <div class="card p-3">
          <h5 class="name">Postes</h5>
          <div class="table-responsive">
            <table class="table rounded-3">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Libelle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in jobs" :key="job.id">
                  <td style="display: flex; align-content: center">
                    <p class="mt-auto mb-auto ml-2" v-text="job.id"></p>
                  </td>
                  <td>
                    <p class="mt-auto mb-auto" v-text="job.label"></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <v-row justify="center">
            <v-dialog v-model="dialog" width="750px">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-plus" color="deep-purple-darken-1" v-bind="props"> </v-btn>
              </template>

              <v-card class="gradient">
                <v-form v-on:submit.prevent="formAddJob">
                  <v-card-title>
                    <v-row justify="center" class="mt-3">
                      <h1 class="form-title">Créer un nouveau poste</h1>
                    </v-row>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            label="Libelle du poste*"
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
export default {
  name: "Job",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      jobs: [],
      error: "",
      errorState: false,
      SuccessState: false,
      snackbar: false,
    };
  },
  methods: {
    formAddJob: function () {
      if (this.form.label !== "") {
        Axios
          .post("http://localhost:8080/api/job", {
            label: this.form.label,
          })
          .then(
            (response) => {
              console.log(response);
              this.dialog = false;
              this.errorState = false;
              this.SuccessState = true;
              this.success = "Nouveau métier créé";
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
  created() {
    Axios.get("http://localhost:8080/api/jobs").then((res) => {
      this.jobs = res.data?.job;
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
