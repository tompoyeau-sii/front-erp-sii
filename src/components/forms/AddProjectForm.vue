<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        prepend-icon="mdi-plus"
        color="deep-purple-darken-3"
        v-bind="props"
      >
        Créer un nouveau projet
      </v-btn>
    </template>
    <v-card class="gradient">
      <v-form v-on:submit.prevent="formAddProject">
        <v-card-title>
          <v-row justify="center" class="mt-3">
            <h1  class="form-title">Créer un nouveau projet</h1>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Libelle du projet*"
                  v-model="form.label"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="ADV*"
                  v-model="form.adv"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="form.customer"
                  :items="customers"
                  item-title="label"
                  item-value="id"
                  label="Client*"
                  variant="solo"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="form.manager"
                  :items="managers"
                  item-title="full_name"
                  item-value="id"
                  label="Manager*"
                  variant="solo"
                ></v-autocomplete>
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
</template>

<script>
import Axios from "@/_services/caller.service";
export default {
  name: "AddProjectForm",
  data() {
    return {
      form: {
        label: "",
        adv: null,
        customer: null,
        manager: null,
      },
      dialog: false,
      error: "",
      projects: [],
      SuccessState: false,
      snackbar: false,
      associates: [],
      customers: [],
      managers: [],
    };
  },
  created() {
    Axios.get("/projects").then((res) => {
      this.projects = this.$route.params.Projects;
    });

    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
    });

    Axios.get("/associates/managers").then((res) => {
      //this.managers = res.data?.associate;
      console.log(res.data?.associate)
      res.data?.associate.forEach(manager => {
        manager.full_name = manager.first_name + ' ' + manager.name
        this.managers.push(manager)
      });
    });
  },
  methods: {
    formAddProject: function () {
      if (
        this.form.label !== "" &&
        this.form.adv !== "" &&
        this.form.customer !== "" &&
        this.form.manager !== ""
      ) {
        Axios.post("/project", {
          label: this.form.label,
          adv: this.form.adv,
          customer_id: this.form.customer,
          manager_id: this.form.manager,
        }).then(
          (response) => {
            this.dialog = false;
            this.CreateState = false;
            this.SuccessState = true;
            this.success = "Nouveau projet créé";
            this.error = "";
            this.refresh();
          },
          (response) => {
            this.SuccessState = false;
            console.log(response);
            this.error = response.data;
            console.log("erreur : " + this.error);
          }
        );
      } else {
        this.error = "Veuillez remplir tous les champs.";
      }
    },
  },
};
</script>

<style>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
</style>