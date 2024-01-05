<template>
    <div>
      <h2>Car Images List</h2>
      <ul>
        <li v-for="image in carImages" :key="image.id">
          <router-link :to="{ name: 'CarImageDetail', params: { carId: car.id, imageId: image.id } }">
            <img :src="image.image" alt="Car Image" style="max-width: 100px; max-height: 100px;" />
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        carImages: [],
        carId: 1, // Replace with the actual car ID
      };
    },
    mounted() {
      this.fetchCarImages();
    },
    methods: {
      async fetchCarImages() {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${this.carId}/images/`);
          this.carImages = await response.json();
        } catch (error) {
          console.error('Error fetching car images:', error);
        }
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  