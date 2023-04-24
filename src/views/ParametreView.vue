<template>
  <div class="container">

    <h1 class="title pt-3">Ajouter des attributs</h1>
    <div class="row">
      <div class="col-2">
        
        <Diplome />
      </div>
      <div class="col-2">
        <Jobs />

      </div>
    </div>
  </div>
  <myToolBar />
</template>

<script>
// Components
import Parametre from "@/components/parameters/Parametre.vue";
import myToolBar from "@/components/MyToolbar.vue";
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
export default {
  name: "ParametreView",

  components: {
    Parametre,
    myToolBar,
    Diplome,
    Jobs,
  },
};
</script>

<style scoped>
</style>