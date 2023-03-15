<template>
  <Collaborateurs />
  <myToolbar />
</template>

<script>
import Collaborateurs from "@/components/Collaborateurs.vue";
import myToolbar from "@/components/MyToolbar";
export default {
  name: "CollabView",

  components: {
    Collaborateurs,
    myToolbar,
  },
};
</script>
