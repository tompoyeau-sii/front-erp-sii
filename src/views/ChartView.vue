<template>
  <Statistiques />
  <myToolBar />
</template>

<script>
// Components
import Statistiques from "@/components/Statistiques.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "ChartView",

  components: {
    Statistiques,
    myToolBar,
  },
};
</script>

<style scoped>
</style>