<template>
  <Pdc />
  <myToolBar />
</template>

<script>
// Components
import Pdc from "@/components/Pdc.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "FicheClientView",

  components: {
    Pdc,
    myToolBar,
  },
};
</script>

<style scoped>
</style>