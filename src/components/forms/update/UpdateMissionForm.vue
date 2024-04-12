<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-pencil" color="transparent" elevation="0" v-bind="props">
      </v-btn>
    </template>
    <v-card class="gradient">
      <v-window>
        <v-window-item>
          <v-form v-on:submit.prevent="formAddMission">
            <v-card-title>
              <v-row justify="center" class="mt-3">
                <h1 class="form-title">Modifier la mission</h1>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="TJM*"
                      variant="solo"
                      v-model="form.tjm"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label>Date de mise à jour du TJM</label>
                    <v-radio-group v-model="radioTjm" inline>
                      <v-radio label="Aujourd'hui" value="1"></v-radio>
                      <v-radio label="Une date précise" value="2"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col v-if="radioTjm == 2" cols="12">
                    <v-text-field
                      label="Date de début du nouveau TJM*"
                      variant="solo"
                      type="date"
                      v-model="form.tjm_start_date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de début de mission*"
                      variant="solo"
                      type="date"
                      v-model="form.start_date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de fin de mission*"
                      variant="solo"
                      v-model="form.end_date"
                      type="date"
                    ></v-text-field>
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
                  </v-col>
                </v-row>
              </v-container>
              <small>*champs obligatoire</small>
            </v-card-text>
          </v-form>
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="white"
          variant="text"
          type="submit"
          @click="formAddMission()"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "AddMissionForm",
  props: [
    "mission_id",
    "mission_tjm",
    "mission_start_date",
    "mission_end_date",
  ],
  data() {
    return {
      associate: this.associate_id,
      form: {
        tjm: this.mission_tjm,
        tjm_start_date: this.tjm_start_date,
        start_date: this.mission_start_date,
        end_date: this.mission_end_date,
      },
      dialog: false,
      error: "",
      success: "",
      SuccessState: false,
      snackbar: false,
      radioTjm: "1",
    };
  },
  methods: {
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
    },
    formAddMission() {
      if (
        this.form.start_date != null &&
        this.form.end_date != null &&
        this.form.tjm != null &&
         this.form.start_date != "" &&
        this.form.end_date != "" &&
        this.form.tjm != "" 
      ) {
        if (this.form.start_date < this.form.end_date) {
          Axios.put("/mission/update/" + this.mission_id, {
            tjm: this.form.tjm,
            tjm_start_date: this.form.tjm_start_date,
            start_date: this.form.start_date,
            end_date: this.form.end_date,
          })
            .then((response) => {
              this.form.tjm_start_date = null;
              this.dialog = false;
              this.CreateState = false;
              this.SuccessState = true;
              this.success = "Mission mise à jour";
              this.$emit("associateUpdated");
              this.snackbar = true;
              this.error = "";
            })
            .catch((err) => {
              this.error = err.response.data.error;
            });
        } else {
          this.error = "La date début doit être inférieur à la date de fin !";
        }
      } else {
        this.error = "Remplissez tous les champs.";
      }
    },
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
  },
};
</script>

<style scoped>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>
