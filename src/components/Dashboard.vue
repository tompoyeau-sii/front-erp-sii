<template>
  
</template>

<script>
export default {
  name: 'dashboard',
    data: () => ({
      step: 1,
    }),

    computed: {
      currentTitle () {
        switch (this.step) {
          case 1: return 'Créer une nouvelle mission'
          case 2: return 'Gestion des imputations'
        }
      },
    },
  }
</script>

<style scoped>
</style>