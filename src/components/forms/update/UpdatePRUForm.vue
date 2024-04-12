<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="text"
        icon="mdi-pencil"
        color="deep-purple-darken-1"
        v-bind="props"
      />
    </template>
    <v-card class="gradient">
      <v-form fast-fail @submit.prevent v-on:submit.prevent="formPRUForm">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1 class="form-title">Modifier un PRU</h1>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Valeur*"
                  v-model="form.value"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="solo"
                  label="Date de début*"
                  type="date"
                  v-model="form.start_date"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Date de fin*"
                  variant="solo"
                  type="date"
                  v-model="pru.end_date"
                >
                </v-text-field>
              </v-col>

              <v-alert
                v-if="error != ''"
                class="mb-5 vibrate"
                icon="mdi-close"
                type="error"
                border
                :text="error"
                m-5
              ></v-alert>
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
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "UpdateClientForm",
  props: ["pru"],
  data() {
    return {
      form: {
        value: this.pru.value,
        start_date: this.pru.start_date,
        end_date: this.pru.end_date,
      },
      dialog: false,
      error: "",
      SuccessState: false,
      snackbar: false,
    };
  },
  methods: {
    formPRUForm() {
      if (
        this.form.value !== "" ||
        this.form.value !== null ||
        this.form.start_date !== "" ||
        this.form.start_date !== null ||
        this.form.end_date !== "" ||
        this.form.end_date !== null
      ) {
        Axios.put("/pru/update/" + this.pru.id, {
          value: this.form.value,
          start_date: this.form.start_date,
          end_date: this.form.end_date,
        })
          .then((response) => {
            console.log(response)
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "PRU modifié";
            this.$emit("pruUpdated");
            this.error = "";
          })
          .catch((err) => {
            console.log(err);
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
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}

.name {
  font-weight: 600;
}
</style>