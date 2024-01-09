<template>
    <div class="mt-24">
      <h2>Review Detail</h2>
      <div v-if="review">
        <p>Customer: {{ review.username }}</p>
        <p>Car: {{ review.car.name }}</p>
        <p>Rating: {{ review.rating }}</p>
        <p>Description: {{ review.description }}</p>
      </div>
      <div v-else>
        <p>Review not found</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        review: null,
      };
    },
    methods: {
      fetchReviewData() {
        axios.get(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/reviews/${this.$route.params.id}`)
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
  };
  </script>
  
  <style>
  </style>
  