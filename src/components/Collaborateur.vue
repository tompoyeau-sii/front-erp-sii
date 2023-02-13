<template>
  <div class="container">
    <h1 class="p-3">Collaborateurs SII Le Mans</h1>
    <div class="table-responsive p-3">
      <table class="table rounded-3 shadow bg-white">
        <thead>
          <tr style="border: white">
            <th>Collaborateur</th>
            <th>Poste</th>
            <th>Client</th>
            <th>Manager</th>
            <th>Groupe horaire</th>
            <th>Âge</th>
            <th>Pôle</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="border: white"
            v-for="message in messages"
            :key="message.id"
          >
            <td style="display: flex; align-content: center">
              <v-avatar>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>
              <p class="mt-auto mb-auto ml-2" v-text="message.prenom + ' ' + message.nom"></p>
            </td>
            <td>none</td>
            <td>none</td>
            <td>none</td>
            <td v-text="message.tauxHoraire"></td>
            <td v-text="message.dateNaiss"></td>
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
      messages: [],
    };
  },
  methods: {
    getAge(age) {
      var diff = Date.now() - date.getTime();
      var age = new Date(diff);
      return Math.abs(age.getUTCFullYear() - 1970);
    },
  },
  created() {
    axios.get("http://localhost:8080/api/collaborateur").then((res) => {
      this.messages = res.data?.collaborateur;
      console.log(res.data?.collaborateur);
    });
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}

</style>
