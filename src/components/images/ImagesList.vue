<template>
  <div class="mt-24">
    <h2 class="text-2xl font-semibold mb-4">Car Images List</h2>

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

    <!-- Check if the user is staff, and show the upload form -->
    <div v-if="isStaff" class="mb-4">
      <h3 class="text-lg font-semibold mb-2">Upload Image</h3>
      <form @submit.prevent="uploadImage">
        <input type="file" accept="image/*" @change="handleFileChange" ref="imageInput" />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="image in carImages"
        :key="image.id"
        :to="{ name: 'ImageDetail', params: { carId: carId, imageId: image.id } }"
        class="w-full md:1/3 group relative overflow-hidden rounded-lg border border-gray-300 transition-transform duration-300 transform hover:scale-105"
      >
        <img
          :src="getImageUrl(image.image)"
          alt="Car Image"
          class="w-full h-80 object-cover rounded-t-lg"
        />
        <div class="p-2 bg-white border-t border-gray-200">
          <p class="text-gray-800 font-semibold group-hover:text-blue-500">{{ image.description }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const carId = ref(route.params.carId);

  const carImages = ref([]);
  const imageFile = ref(null);

  const isStaff = computed(() => store.state.isStaff);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = computed(() => store.state.accessToken);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchCarImages = async () => {
    try {

      const response = await axios.get(
        `${BASE_API_URL}/cars/${carId.value}/images/`
      );

      if (response.status === 200) {
        const data = response.data;
        carImages.value = data;
      } else {
        errorMessage.value = 'Error fetching car images';
        router.push({ name: 'CarDetail', params: { carId: carId.value }, query: { errorMessage: 'Error fetching car images' } });
      }
    } catch (error) {
      errorMessage.value = 'Error fetching car images';
      carImages.value = [];
      router.push({ name: 'CarDetail', params: { carId: carId.value }, query: { errorMessage: 'Error fetching car images' } });
    }
  };

  watch(() => carId, fetchCarImages, { immediate: true });

  const getImageUrl = (relativeUrl) => {
    return relativeUrl.startsWith('http')
      ? relativeUrl
      : `http://localhost:8000/${relativeUrl}`;
  };

  const uploadImage = async () => {
    try {

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${accessToken.value}`,
      };

      const formData = new FormData();
      formData.append('image', imageFile.value);

      const response = await axios.post(
        `${BASE_API_URL}/cars/${carId.value}/images/`,
        formData,
        { headers }
      );

      if (response.status === 201) {
        const data = response.data;
        fetchCarImages();
        successMessage.value = 'Image uploaded successfully';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: data.id }, query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = 'Error uploading image';
        router.push({ name: 'ImagesList', params: { carId: carId.value }, query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = error.response.data.image[0];
      router.push({ name: 'ImagesList', params: { carId: carId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const handleFileChange = (event) => {
    imageFile.value = event.target.files[0];
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
  };

</script>
