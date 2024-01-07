<template>
  <div class="mt-24">
    <h1 class="text-4xl font-bold mb-4">Available Cars</h1>
    <div class="container mx-auto mt-8 flex flex-wrap pt-16">
    <router-link
      v-for="car in cars"
      :key="car.id"
      :to="{ name: 'CarDetail', params: { id: car.id, name: car.name} }"
      class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4 mb-8"
    >
    <div class="bg-white rounded-lg border">
        <div class="h-40 overflow-hidden border-b pb-4 pt-2">
          <img
            :src="car.images.length > 0 ? car.images[0].image : ''"
            :alt="car.name"
            class="w-full h-full object-contain object-center"
          />
        </div>

        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-base font-semibold">{{ car.name }}({{ car.model }})</h2>
            <!-- <p class="text-gray-600 mb-2">{{ car.gearbox }}</p> -->

          <p class="text-black font-semibold text-sm">
            ${{ car.price }} <span class="font-normal">per a day</span>
          </p>
        </div>
      </div>
      </div>
    </router-link>
        <!-- <router-link :to="{ name: 'CarReviewsList', params: { carId: car.id }}" class="text-blue-500 hover:underline">
          View Reviews
        </router-link> -->
        </div>
  </div>
</template>


<script>
// Import axios library
import axios from 'axios';

export default {
  name: 'CarsList',
  components: {},
  data() {
    return {
      cars: [],
    };
  },
  created() {
    axios.get('http://127.0.0.1:8000/api/v1/cars/')
      .then(response => {
        this.cars = response.data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
};
</script>


<style></style>