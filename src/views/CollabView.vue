<template>
  <myToolbar />
  <Collaborateur />
</template>

<script>
import myToolbar from "@/components/MyToolbar";
import Collaborateur from "@/components/Collaborateur.vue";
export default {
  name: "CollabView",

  components: {
    Collaborateur,
    myToolbar,
  },
};
</script>
