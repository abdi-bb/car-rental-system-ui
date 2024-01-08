<template>
  <div class="home mt-24">
    <h1 class="text-4xl font-bold mb-4">Welcome to Car Rental System</h1>
    <p class="text-lg mb-6">Explore our wide range of high-quality cars for rent. Whether you need a sedan for a business trip or an SUV for a family vacation, we have the perfect vehicle for you.</p>

    <div class="grid grid-cols-1 gap-6">
      <h2 class="text-2xl mb-4">Featured Cars</h2>
      <div v-for="car in featuredCars" :key="car.id" class="mb-6">
        <h3 class="text-xl font-bold mb-2">{{ car.name }}</h3>
        <!-- Display stars based on average rating -->
        <div class=" mb-2">
          <span v-for="star in stars(car.average_rating)" :key="star" class="text-yellow-500 text-xl">★</span>
        </div>
        <router-link :to="{ name: 'CarDetail', params: { id: car.id }}">
          <!-- Check if the car has images before displaying -->
          <img v-if="car.images && car.images.length > 0" :src="car.images[0].image" :alt="car.name" class="w-full max-w-lg mx-auto h-auto" />
        </router-link>
        <!-- Check if the car has reviews before displaying -->
        <p v-if="car.reviews && car.reviews.length > 0" class="text-sm">{{ car.reviews[0].description }}</p>
      </div>
    </div>

    <p class="text-lg mt-8">Ready to hit the road? Rent a car with us today!</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      featuredCars: [],
    };
  },
  methods: {
    stars(rating) {
      // Round the rating to the nearest half and convert it to the number of full stars
      return Math.round(rating * 2) / 2;
    },
  },
  created() {
    axios.get('http://127.0.0.1:8000/api/v1/cars')
      .then(response => {
        // Filter out cars without images
        this.featuredCars = response.data
          .filter(car => car.images && car.images.length > 0)
          .sort((a, b) => b.average_rating - a.average_rating) // Sort in descending order
          .slice(0, 3); // Limit to the first 3 cars
      })
      .catch(error => {
        console.error('Error fetching featured cars data:', error);
      });
  },
};
</script>

<style>
</style>
