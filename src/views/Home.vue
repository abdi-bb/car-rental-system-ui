<template>
  <div class="home">
    <div>
      <!-- Banner Section -->
      <header class="banner text-white py-28 text-center pb-18" :style="{ backgroundImage: 'url(' + bannerImage + ')', backgroundSize: 'cover', backgroundPosition: 'right', backgroundAttachment: 'fixed', background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%), url(' + bannerImage + ')' }">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold">Discover Your Next Adventure.</h1>
          <p class="mt-4 text-lg font-semibold">Rent a car and hit the road with confidence.</p>
          <router-link :to="{ name: 'CarsList' }">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold py-3 px-8 mt-8 rounded-full">
              Get Started
              <i class="fa-solid fa-arrow-right ml-2 w-2"></i>
            </button>
          </router-link>
        </div>
      </header>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <h2 class="col-span-3 text-2xl mb-4">Featured Cars</h2>

      <div v-if="isLoading" class="col-span-3 text-center">
        <font-awesome-icon class="fas fa-spinner-third fa-spin text-4xl"></font-awesome-icon>
        <p class="text-lg mt-4">Loading...</p>
      </div>

      <div v-for="car in featuredCars" :key="car.id" class="mb-6 col-span-1">
        <div class="bg-white rounded-lg overflow-hidden shadow-md p-4">
          <h3 class="text-xl font-bold mb-2">{{ car.name }}</h3>
          <!-- Display stars based on average rating -->
          <div class=" mb-2">
            <span v-for="star in car.stars" :key="star" class="text-yellow-500 text-xl">★</span>
          </div>
          <router-link :to="{ name: 'CarDetail', params: { carId: car.id }}">
            <!-- Check if the car has images before displaying -->
            <img v-if="car.images && car.images.length > 0" :src="car.images[0].image" :alt="car.name" class="w-full max-w-lg mx-auto h-auto transform hover:scale-105 transition duration-500">
          </router-link>
          <!-- Check if the car has reviews before displaying -->
          <div v-if="car.reviews && car.reviews.length > 0" class="text-sm mb-4">
            <p>{{ car.reviews[0].description }}</p>
            <p class="text-gray-500">- {{ car.reviews[0].username || 'Anonymous User' }}</p>
          </div>
          <router-link :to="{ name: 'CarsList' }" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded">View More Cars</router-link>
        </div>
      </div>
    </div>

    <p class="text-lg mt-8">Ready to hit the road? Rent a car with us today!</p>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const featuredCars = ref([]);
  const isLoading = ref(false);
  const bannerImage = ref(require('@/assets/img/featured4.png'));

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  onMounted(() => {
    isLoading.value = true;
    axios.get(`${BASE_API_URL}/cars`)
      .then(response => {
        featuredCars.value = response.data
          .sort((a, b) => b.stars - a.stars) // Sort in descending order
          .slice(0, 3); // Limit to the first 3 cars
      })
      .catch(error => {
        console.error('Error fetching featured cars data:', error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  });
</script>

<style scoped>
.banner {
  background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%);
  background-size: cover;
  background-position: right;
  background-attachment: fixed;
}
</style>
