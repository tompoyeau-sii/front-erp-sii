<template>
  <v-row justify="end" class="m-3">
    <v-dialog v-model="dialog" width="750px">
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus"
          color="deep-purple-darken-1"
          v-bind="props"
        >
          Compte
        </v-btn>
      </template>
      <v-card>
        <v-form v-on:submit.prevent="formAddAccount">
          <v-card-title>
            <v-row justify="center" class="mt-3">
              <h1 class="form-title">Créer un nouveau compte</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Prenom*"
                    v-model="form.first_name"
                    required
                    variant="solo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nom*"
                    variant="solo"
                    v-model="form.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nom d'utilisateur*"
                    disabled
                    variant="solo"
                    v-model="username"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                  label="Mot de passe*"
                    variant="solo"
                    v-model="form.password"
                    autocomplete="off"
                    type="password"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" variant="text" @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn
              color="white"
              variant="text"
              type="submit"
              @click="snackbar = true"
            >
              Créer le compte !
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
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "AddCollabForm",
  data() {
    return {
      form: {
        name: "",
        first_name: "",
        password: "",
      },
      dialog: false,
      success: "",
      SuccessState: false,
      error: "",
    };
  },

  methods: {
    formAddAccount() {
      if (
        this.form.first_name != "" &&
        this.form.name != "" &&
        this.form.password != ""
      ) {
        Axios.post("/register", {
          name: this.form.name,
          first_name: this.form.first_name,
          username: this.username,
          password: this.form.password,
        })
          .then((response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Nouveau compte créé.";
            this.error = "";
          })
          .catch((err) => {
            console.log(err);
            this.error = err.response.data.error;
          });
      } else {
        this.error = "Veuillez compléter tous les champs.";
      }
    },
  },

  computed: {
    username() {
      let first_name = this.form.first_name.toLowerCase();
      first_name = first_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");

      let name = this.form.name.toLowerCase();
      name = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");

      return first_name + "." + name;
    },
  },
};
</script>

<style typ>
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
</style>