<template>
  <div class="mt-24">
    <h2 class="text-3xl font-bold mb-4">Review Detail</h2>
    <div v-if="review" class="bg-white rounded-md shadow-md p-6">
      <p class="text-lg font-semibold mb-2">Customer: {{ review.username }}</p>
      <p class="text-gray-700 mb-2">Car: {{ review.car_name }}</p>
      <p class="text-gray-700 mb-2">Rating: {{ review.rating }}</p>
      <p class="text-gray-700 mb-2">Description: {{ review.description }}</p>
      <p class="text-gray-700 mb-2">Created At: {{ formatReadableDate(review.created_at) }}</p>
      <p class="text-gray-700">Updated At: {{ formatReadableDate(review.updated_at) }}</p>
    </div>
    <div v-else class="text-gray-500 mt-4">
      <p>Review not found</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DateService from '../../services/DateService';

export default {
  data() {
    return {
      review: null,
    };
  },
  methods: {
    fetchReviewData() {
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/reviews/${this.$route.params.reviewId}`)
        .then(response => {
          this.review = response.data;
        })
        .catch(error => {
          console.error('Error fetching review data:', error);
          this.review = null;
        });
    },
    formatReadableDate(dateString) {
      return DateService.formatReadableDate(dateString);
    },
  },
  created() {
    this.fetchReviewData();
  },
};
</script>

<style>
</style>
