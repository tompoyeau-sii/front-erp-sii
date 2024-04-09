<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        class="text-none mr-3"
        color="deep-purple-darken-1"
        variant="text"
        icon="mdi-reload"
        v-bind="props"
      >
      </v-btn>
    </template>
    <v-card class="gradient">
      <v-form fast-fail @submit.prevent v-on:submit.prevent="LoadSave">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1 class="form-title">Charger une version</h1>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                Attention ! Charger cette version supprimera les données non
                sauvegardées. Sauvegardez les avant si vous souhaitez revenir
                dessus plus tard.
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
            prepend-icon="mdi-reload"
            color="white"
            type="submit"
            :loading="loading"
            @click="snackbar = true"
          >
            Charger
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
  name: "LoadSaveConfirmation",
  props: ["filename"],
  data() {
    return {
      dialog: false,
      error: "",
      SuccessState: false,
      snackbar: false,
      loading: false,
    };
  },
  methods: {
    LoadSave() {
      this.loading = true;
      Axios.put("http://localhost:8080/api/production/simulation/LoadSave/", {
        userId: localStorage.getItem("userId"),
        fileName: this.filename,
      })
        .then((response) => {
          this.dialog = false;
           this.loading = false;
          this.CreateState = false;
          this.SuccessState = true;
          this.success = response.data.message;
          this.error = "";
        })
        .catch((err) => {
           this.loading = false;
          this.error = err.response.data.error;
          this.SuccessState = false;
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

.name {
  font-weight: 600;
}
</style>