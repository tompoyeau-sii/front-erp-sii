<template>
  <div class="container">
    <h1 class="title pt-3">Collaborateurs SII Le Mans</h1>

    <v-row justify="end" class="m-3">
      <v-dialog v-model="dialog" width="750px">
        <template v-slot:activator="{ props }">
          <v-btn prepend-icon="mdi-plus" color="success" v-bind="props">
            Ajouter un collaborateur
          </v-btn>
        </template>
        <v-card
          style="
            background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
            color: white;
          "
        >
          <v-form v-on:submit.prevent="formAddCollab">
            <v-card-title>
              <v-row justify="center" class="mt-3">
                <h1>Ajouter un nouveau collaborateur</h1>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
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
                      label="Prenom*"
                      v-model="form.first_name"
                      required
                      variant="solo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-radio-group inline>
                      <v-radio label="Homme" value="homme"></v-radio>
                      <v-radio label="Femme" value="femme"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Diplôme" variant="solo"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date de naissance*"
                      variant="solo"
                      type="date"
                      v-model="form.birthdate"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Téléphone*"
                      variant="solo"
                      v-model="form.telephone"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Email*"
                      variant="solo"
                      v-model="form.mail"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Date d'embauche*"
                      variant="solo"
                      type="date"
                      v-model="form.start_date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="PRU" variant="solo"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="['Staff', 'Dev', 'Data', 'Chef de projet']"
                      label="Métier"
                      variant="solo"
                    ></v-autocomplete>
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
                @click="dialog = false"
              >
                Bienvenue !
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>

    <div class="table-responsive p-3">
      <table class="table rounded-3 shadow bg-white">
        <thead>
          <tr style="border: white">
            <th>Collaborateur</th>
            <th>Métier</th>
            <th>Client</th>
            <th>Manager</th>
            <th>Projet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="associate in associates" :key="associate.id">
            <td style="display: flex; align-content: center">
              <v-avatar>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>
              <p
                class="mt-auto mb-auto ml-2"
                v-text="associate.first_name + ' ' + associate.name"
              ></p>
            </td>
            <td>none</td>
            <td>none</td>
            <td>none</td>
            <td>none</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Collaborateur",
  data() {
    return {
      form: {
        name:"",
        first_name :"",
        birthdate :"",
        telephone :"",
        mail :"",
        start_date :"",
      },
      dialog: false,
      associates: [],
      customers: [],
    };
  },
  methods: {
    formAddCollab: function () {
      if (
        this.form.name !== "" ||
        this.form.first_name !== "" ||
        this.form.birthdate !== "" ||
        this.form.telephone !== "" ||
        this.form.mail !== "" ||
        this.form.start_date !== ""
      ) {
        axios
          .post("http://localhost:8080/api/associate", {
            name: this.form.name,
            first_name: this.form.first_name,
            birthdate: this.form.birthdate,
            start_date: this.form.start_date,
            telephone: this.form.telephone,
            mail: this.form.mail,
          })
          .then(
            (response) => {
              console.log(response);
              this.dialog = false;
              this.state = "";
            },
            (error, response) => {
              console.log(response);
            }
          );
      } else {
        this.state = "Vous devez ajouter au moins un libelle.";
      }
    },
    getAge(age) {
      var diff = Date.now() - date.getTime();
      var age = new Date(diff);
      return Math.abs(age.getUTCFullYear() - 1970);
    },
  },
  created() {
    axios.get("http://localhost:8080/api/associate").then((res) => {
      this.associates = res.data?.associate;
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
</style>
