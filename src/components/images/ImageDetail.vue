<template>
    <div>
      <h2>Car Image Detail</h2>
      <img :src="image.image" alt="Car Image" style="max-width: 400px; max-height: 400px;" />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        image: {},
        carId: 1, // Replace with the actual car ID
        imageId: 1, // Replace with the actual image ID
      };
    },
    mounted() {
      this.fetchCarImage();
    },
    methods: {
      async fetchCarImage() {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${this.carId}/images/${this.imageId}/`);
          this.image = await response.json();
        } catch (error) {
          console.error('Error fetching car image:', error);
        }
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  