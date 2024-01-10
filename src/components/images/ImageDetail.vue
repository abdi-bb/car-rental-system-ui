<template>
  <div class="mt-24">
    <h2 class="text-2xl font-semibold mb-4">Car Image Detail</h2>
    <img
      :src="getImageUrl(image && image.image)"
      alt="Car Image"
      class="w-full h-112 object-cover rounded-lg"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: {},
    };
  },
  watch: {
    '$route.params': {
      handler: 'fetchCarImage',
      immediate: true,
    },
  },
  methods: {
    async fetchCarImage() {
      try {
        const { carId, imageId } = this.$route.params;
        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${carId}/images/${imageId}/`);
        this.image = await response.json();
      } catch (error) {
        console.error('Error fetching car image:', error);
      }
    },
    getImageUrl(relativeUrl) {
      return relativeUrl && relativeUrl.startsWith('http') ? relativeUrl : `http://localhost:8000/${relativeUrl}`;
    },
  },
};
</script>

<style>
</style>
