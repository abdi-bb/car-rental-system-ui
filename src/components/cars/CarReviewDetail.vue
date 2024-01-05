<template>
  <div class="container mt-4">
    <h2 class="mb-4">Review Detail</h2>
    <div v-if="review">
      <div v-if="review.car_images && review.car_images.length > 0">
        <ul class="list-unstyled d-flex">
          <li v-for="(image, index) in review.car_images" :key="index" class="mr-2">
            <img :src="image.image" alt="Car Image" class="img-thumbnail" style="max-width: 100px; max-height: 100px;" />
          </li>
        </ul>
      </div>
      <p class="mt-3"><strong>Car Name:</strong> {{ review.car_name }}</p>
      <p><strong>Reviewer:</strong> {{ review.username }}</p>
      <p><strong>Stars:</strong> {{ review.rating }}</p>
      <p><strong>Description:</strong> {{ review.description }}</p>
      <p><strong>Date:</strong> {{ dateService.formatReadableDate(review.updated_at) }}</p>
    </div>
    <div v-else>
      <p>Review not found</p>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import dateService from '@/services/DateService';
  
  export default {
    data() {
      return {
        review: null,
      };
    },
    methods: {
      fetchReviewData() {
        const carId = this.$route.params.carId;
        const reviewId = this.$route.params.reviewId;
        axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/reviews/${reviewId}`)
          .then(response => {
            this.review = response.data;
          })
          .catch(error => {
            console.error('Error fetching review data:', error);
            this.review = null;
          });
      },
    },
    created() {
      this.fetchReviewData();
    },
    computed: {
      dateService() {
        return dateService;
      },
    },
  };
  </script>
  
  <style>
  </style>
  