<template>
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-cached"
          color="deep-purple-darken-1"
          variant="flat"
          class="text-none mb-4 mr-3"
          v-bind="props"
        >
          Réinitialiser les données de ma simulation
        </v-btn>
      </template>
      <v-card class="gradient">
        <v-form fast-fail @submit.prevent v-on:submit.prevent="formProdToSimu">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Attention !</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <p style="font-weight: bold;">
                    Actualiser les données supprimera les données non
                    sauvegardées. Sauvegardez les avant si vous souhaitez revenir
                    dessus plus tard.
                  </p>
                </v-col>
              </v-row>
            </v-container>
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
              :loading="loading"
              @click="snackbar = true"
            >
              Actualiser
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
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "AddClientForm",
  data() {
    return {
      form: {
        label: "",
      },
      dialog: false,
      error: "",
      SuccessState: false,
      snackbar: false,
      loading: false,
    };
  },
  methods: {
    formProdToSimu() {
       this.loading = true;
       console.log(localStorage.getItem("userId"))
      Axios.post("http://localhost:8080/api/production/simulation/ProdToSimu", {
        userId: localStorage.getItem("userId"),
      })
        .then((response) => {
          this.SuccessState = true;
           this.dialog = false;
          this.snackbar = true;
          this.refresh = false;
           this.loading = false;
          this.success = response.data?.message;
           this.error = "";
        })
        .catch((err) => {
          console.log(err);
           this.loading = false;
          this.error = err.response.data.error;
        });
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