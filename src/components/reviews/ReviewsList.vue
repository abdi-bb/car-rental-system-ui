<template>
  <div class="mt-24">
    <h2 class="text-2xl font-bold mb-4">Reviews for Car {{ carName }}</h2>
    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <ul v-else-if="formattedReviews.length > 0" class="space-y-4">
      <li v-for="review in formattedReviews" :key="review.id" class="bg-white rounded-md shadow-md p-4">
        <router-link :to="{ name: 'ReviewDetail', params: { carId: $route.params.carId, reviewId: review.id }}">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-lg font-semibold">{{ review.username }}</span>
              <span class="text-gray-500 ml-2">Rating: {{ review.rating }}</span>
            </div>
            <span class="text-gray-500">{{ review.readableDate }}</span>
          </div>
        </router-link>
        <p class="mt-2 text-gray-700">{{ review.description }}</p>
      </li>
    </ul>
    <p v-else class="text-gray-500">No reviews yet.</p>
  </div>
</template>

<script>
import axios from 'axios';
import DateService from '../../services/DateService';

export default {
  data() {
    return {
      reviews: [],
      carName: '',
      isLoading: true,
    };
  },
  methods: {
    fetchReviews() {
      const carId = this.$route.params.carId;
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/reviews`)
        .then(response => {
          this.reviews = response.data;
          this.fetchCarName();
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
        });
    },
    fetchCarName() {
      const carId = this.$route.params.carId;
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/`)
        .then(response => {
          this.carName = response.data.name;
          this.isLoading = false; // Set loading to false once data is loaded
        })
        .catch(error => {
          console.error('Error fetching car name:', error);
        });
    },
    // Access the formatReadableDate function from the imported DateService
    formatReadableDate(dateString) {
      return DateService.formatReadableDate(dateString);
    },
  },
  computed: {
    formattedReviews() {
      // Compute formattedReviews based on the existing reviews data
      return this.reviews.map(review => ({
        ...review,
        readableDate: this.formatReadableDate(review.created_at),
      }));
    },
  },
  created() {
    this.fetchReviews();
  },
};
</script>

<style>
</style>
