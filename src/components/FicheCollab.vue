<template>
  <div>
    <div v-if="collab">
      <!-- Afficher les informations du collaborateur -->
      <h1>{{ collab.name }}</h1>
      <p>{{ collab.email }}</p>
    </div>
    <div v-else>
      <!-- Afficher un message de chargement ou d'erreur -->
      <p v-if="loading">Chargement...</p>
      <p v-else>Erreur de chargement des informations du collaborateur.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'FicheCollab',
  props: {
    // Récupérer la propriété collab depuis $route.params
    collab: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  created() {
    if (!this.collab) {
      this.loading = true
      // Effectuer la requête API pour récupérer les informations du collaborateur
      axios.get(`http://localhost:8080/api/associate/${this.$route.params.id}`)
        .then(response => {
          // Mettre à jour la propriété collab avec les informations du collaborateur
          this.$emit('update:collab', response.data)
        })
        .catch(error => {
          console.error(error)
          this.$emit('update:collab', false)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
