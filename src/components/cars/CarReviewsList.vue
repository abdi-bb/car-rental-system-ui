<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Reviews for Car {{ carName }}</h2>
    <ul v-if="reviews.length > 0">
      <li v-for="review in reviews" :key="review.id" class="mb-4">
        <router-link
          :to="{ name: 'CarReviewDetail', params: { carId: $route.params.carId, reviewId: review.id }}"
          class="text-blue-500 hover:underline"
        >
          {{ review.username }} - Rating: {{ review.rating }}
        </router-link>
      </li>
    </ul>
    <p v-else class="text-gray-500">No reviews yet.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CarReviewsList',
  components: {},
  data() {
    return {
      reviews: [],
      carName: '',
    };
  },
  methods: {
    async fetchReviews() {
      try {
        const carId = this.$route.params.carId;
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/reviews`);
        this.reviews = response.data;
        await this.fetchCarName();
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    async fetchCarName() {
      try {
        const carId = this.$route.params.carId;
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/`);
        this.carName = response.data.name;
      } catch (error) {
        console.error('Error fetching car name:', error);
      }
    },
  },
  created() {
    this.fetchReviews();
  },
};
</script>
