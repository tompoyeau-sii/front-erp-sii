<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        class="text-none mr-3"
        color="red-accent-2"
        variant="text"
        icon="mdi-delete"
        v-bind="props"
      ></v-btn>
    </template>
    <v-card class="gradient">
      <v-form fast-fail @submit.prevent v-on:submit.prevent="deleteSave">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1 class="form-title">Supprimer une version</h1>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                Voulez-vous supprimer le version suivante : <strong> {{ filename }} </strong>
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
                </v-col>0.
                
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
            Supprimer
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
  name: "DeleteSaveConfirmation",
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
    deleteSave() {
      this.loading = true
      Axios.post("http://localhost:8080/api/production/simulation/DeleteSave", {
        userId: localStorage.getItem("userId"),
        fileName: this.filename,
      })
        .then((response) => {
          this.dialog = false;
          this.loading = false;
          this.CreateState = false;
          this.SuccessState = true;
          this.success = response.data.message;
          this.$emit("saveDeleted");
          this.error = "";
        })
        .catch(err => {
          console.log(err)
          this.error = err.response.data.error;
          this.loading = false;
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