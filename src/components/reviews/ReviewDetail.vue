<template>
  <div class="mt-24">
    <h2 class="text-3xl font-bold mb-4">Review Detail</h2>

    <!-- Success and error messages -->
    <div v-if="successMessage" class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button @click="clearMessages" class="text-green-700 hover:text-green-900 focus:outline-none">
          X
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
          X
        </button>
      </div>
    </div>

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

            <!-- Success and error messages -->
            <div v-if="successMessage" class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
              <div class="flex items-center justify-between">
                <span>{{ successMessage }}</span>
                <button @click="clearMessages" class="text-green-700 hover:text-green-900 focus:outline-none">
                  X
                </button>
              </div>
            </div>
            <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
              <div class="flex items-center justify-between">
                <span>{{ errorMessage }}</span>
                <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
                  X
                </button>
              </div>
            </div>

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
        <button v-if="isOwner || isStaff" @click="deleteReview" class="bg-red-500 text-white px-4 py-2 rounded mt-8 ml-4">Delete Review</button>
    </div>
    <div v-else class="text-gray-500 mt-4">
      <p>Review not found</p>
    </div>
  </div>
</template>

<script setup>
  // Imports
  import { computed, reactive, ref, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import DateService from '../../services/DateService';

  // Variables
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const review = ref(null);
  const updatedReview = reactive({
    rating: null,
    description: null,
  });

  const updateReviewModalOpen = ref(false);
  const isStaff = computed(() => store.state.isStaff);
  const userId = computed(() => store.state.userId);
  const isOwner = computed(() => userId.value && review.value && parseInt(userId.value) === review.value.user_id);

  const carId = ref(route.params.carId);
  const reviewId = ref(route.params.reviewId);

  // Messages
  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = localStorage.getItem('accessToken');

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  // Methods
  const fetchReviewData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/cars/${carId.value}/reviews/${reviewId.value}`);
      review.value = response.data;

      // Set initial values for the updatedReview object
      updatedReview.rating = review.value.rating;
      updatedReview.description = review.value.description;
    } catch(error) {
      errorMessage.value = 'Error fetching review data';
      console.error('Error fetching review data:', error);
      review.value = null;
      router.push({ name: 'CarsList', query: { errorMessage: errorMessage.value } });
    }
  };

  const formatReadableDate = (dateString) => {
    return DateService.formatReadableDate(dateString);
  };

  const updateReview = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      };

      const requestBody = {
        rating: updatedReview.rating,
        description: updatedReview.description,
      };

      const response = await axios.put(`${BASE_API_URL}/cars/${carId.value}/reviews/${reviewId.value}/`, requestBody, { headers });

      if (response.status === 200) {
        review.value = response.data;
        closeUpdateReviewModal();
        successMessage.value = 'Review updated successfully';
        router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: reviewId.value }, query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = 'Error updating review';
        console.error('Error updating review:', response);
        router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: reviewId.value }, query: { errorMessage: errorMessage.value } });
      }
    } catch(error) {
      errorMessage.value = 'Error updating review';
      console.error('Error updating review:', error);
      router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: reviewId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const deleteReview = async () => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const headers = {
          Authorization: `JWT ${accessToken}`,
        };

        const response = await axios.delete(`${BASE_API_URL}/cars/${carId.value}/reviews/${reviewId.value}`, { headers });

        if (response.status === 204) {
          successMessage.value = 'Review deleted successfully';
          router.push({ name: 'ReviewsList', query: { successMessage: successMessage.value } });
        } else {
          errorMessage.value = 'Error deleting review';
          console.error('Error deleting review:', response);
          router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: reviewId.value }, query: { errorMessage: errorMessage.value } });
        }
      } catch(error) {
        errorMessage.value = 'Error deleting review';
        console.error('Error deleting review:', error);
        router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: reviewId.value }, query: { errorMessage: errorMessage.value } });
      }
    }
  };

  const openUpdateReviewModal = () => {
    updateReviewModalOpen.value = true;
  };

  const closeUpdateReviewModal = () => {
    updateReviewModalOpen.value = false;
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
  };

  // Lifecycle hooks
  onMounted(async () => {
    const isStaff = computed(() => store.state.isStaff);
    const userId = computed(() => store.state.userId);
    const isOwner = computed(() => userId.value && review.value && parseInt(userId.value) === review.value.user_id);

    await fetchReviewData();
  });

  // Watchers
  watch(() => route.params, async () => {
    carId.value = route.params.carId;
    reviewId.value = route.params.reviewId;
    await fetchReviewData();
  });

  watch(() => route.query, () => {
    successMessage.value = route.query.successMessage || '';
    errorMessage.value = route.query.errorMessage || '';
  });
  
</script>

<style>
</style>
