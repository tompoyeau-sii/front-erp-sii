<template>
  <Collaborateurs />
  <myToolBar />
</template>

<script>
import Collaborateurs from "@/components/Collaborateurs.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "CollabView",

  components: {
    Collaborateurs,
    myToolBar,
  },
};
</script>
