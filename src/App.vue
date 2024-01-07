<template>
  <div id="app">
    <CarRentalLayout>
      <router-view />
    </CarRentalLayout>
  </div>
</template>

<script>
import CarRentalLayout from "./views/Layout.vue";

export default {
  name: "App",
  mounted() {
    this.$store.dispatch("initializeApp");
  },
  components: {
    CarRentalLayout,
  },
};
</script>
