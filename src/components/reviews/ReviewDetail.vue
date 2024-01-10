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

        <!-- Button to open the update review modal -->
        <button v-if="!isStaff && isOwner" @click="openUpdateReviewModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-8 mr-4">Update Review</button>
        
        <!-- Modal for updating a review -->
        <div v-if="updateReviewModalOpen" class="fixed inset-0 z-50 overflow-auto flex items-center justify-center" @click.self="closeUpdateReviewModal">
          <div class="modal-content bg-white w-96 mx-auto p-6 rounded-lg shadow-lg" @click.stop>
            <span class="close absolute top-2 right-2 text-gray-600 cursor-pointer" @click="closeUpdateReviewModal">&times;</span>

            <h2 class="text-2xl font-bold mb-4">Update Review</h2>

            <!-- Form for updating a review -->
            <form @submit.prevent="updateReview" class="mb-8">
              <div class="flex flex-col mb-4">
                <label for="rating" class="mb-2 text-lg font-semibold">Rating</label>
                <input v-model="updatedReview.rating" type="number" id="rating" required class="border p-2" />
              </div>

              <div class="flex flex-col mb-4">
                <label for="description" class="mb-2 text-lg font-semibold">Description</label>
                <textarea v-model="updatedReview.description" id="description" required rows="4" class="resize-none border p-2"></textarea>
              </div>

              <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded mt-4">Confirm Update</button>
            </form>
          </div>
        </div>
        <button v-if="isOwner" @click="deleteReview" class="bg-red-500 text-white px-4 py-2 rounded mt-8 ml-4">Delete Review</button>
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
      updatedReview: {
        rating: null,
        description: null,
      },
      updateReviewModalOpen: false,
      isStaff: false,
      isOwner: false,
      userId: null,
    };
  },
  methods: {
    async fetchReviewData() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/reviews/${this.$route.params.reviewId}`)
        this.review = response.data;

        // Set initial values for the updatedReview object
        this.updatedReview.rating = this.review.rating;
        this.updatedReview.description = this.review.description;
        
        this.isOwner = this.userId && this.review && parseInt(this.userId) === this.review.user_id;
        console.log(this.isOwner);
      } catch(error) {
        console.error('Error fetching review data:', error);
        this.review = null;
      }
    },
    formatReadableDate(dateString) {
      return DateService.formatReadableDate(dateString);
    },
    async updateReview() {
      try {
        
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
        
        const requestBody = {
          rating: this.updatedReview.rating,
          description: this.updatedReview.description,
        };

        const response = await fetch(`http://localhost:8000/api/v1/cars/${this.$route.params.carId}/reviews/${this.$route.params.reviewId}/`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          this.review = data;
          this.closeUpdateReviewModal();
          this.$router.push({ name: 'ReviewsList' });
        } else {
          console.error('Error updating review:', response);
        }
      } catch(error) {
        console.error('Error updating review:', error);
      }
    },
    deleteReview() {
      const accessToken = localStorage.getItem('accessToken');
      
      const headers = {
        Authorization: `JWT ${accessToken}`,
      };

      if (confirm('Are you sure you want to delete this review?')) {
        axios.delete(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/reviews/${this.$route.params.reviewId}`, { headers })
          .then(() => {
            this.$router.push({ name: 'ReviewsList' });
          })
          .catch(error => {
            console.error('Error deleting review:', error);
          });
      }
    },
    openUpdateReviewModal() {
      this.updateReviewModalOpen = true;
    },
    closeUpdateReviewModal() {
      this.updateReviewModalOpen = false;
    },
  },
  created() {
    this.$store.dispatch('initializeApp').then(() => {
      this.isStaff = this.$store.state.isStaff;
      this.userId = this.$store.state.userId;
      this.fetchReviewData();
    });
  },
};
</script>

<style>
</style>
