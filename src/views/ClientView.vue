<template>
    <myToolbar />
    <Client />
  </template>
  
  <script>
  import myToolbar from "@/components/MyToolbar";
  import Client from "@/components/Client.vue";
  export default {
    name: "ClientView",
  
    components: {
      Client,
      myToolbar,
    },
  };
  </script>
  