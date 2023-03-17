<template>
  <Client />
  <myToolBar />
</template>
  
  <script>
import Client from "@/components/Client.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "ClientView",

  components: {
    Client,
    myToolBar,
  },
};
</script>
  