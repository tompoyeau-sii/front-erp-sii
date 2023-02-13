<template>
    <myToolbar/>
    <about />
    <Collaborateur />
</template>

<script>
// Components
import Collaborateur from "@/components/Collaborateur.vue";
import myToolbar from "@/components/MyToolbar";
export default ({
  name: "HomeView",

  components: {
    Collaborateur,
    myToolbar,
  },
});
</script>

<style scoped>
</style>