<template>
  <div class="mt-24">
    <h2 class="text-2xl font-semibold mb-4">Car Image Detail</h2>

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

    <img
      :src="getImageUrl(image && image.image)"
      alt="Car Image"
      class="w-full h-112 object-cover rounded-lg"
    />

    <!-- Admin actions -->
    <div v-if="isAdmin">
      <button @click="deleteImage" class="bg-red-500 text-white px-4 py-2 rounded mt-4 mr-8">Delete Image</button>
      <button @click="openUpdateModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-8">Update Image</button>
    </div>

    <!-- Update Image Modal -->
    <div v-if="isUpdateModalOpen" class="modal">
      <div class="modal-content">
        <h2>Update Image</h2>

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

        <input type="file" @change="handleFileChange" />
        <button @click="submitUpdate" class="mr-2">Update</button>
        <button @click="closeUpdateModal" class="ml-2">Cancel</button>
      </div>
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

  const image = ref({});
  const carId = ref(route.params.carId);
  const imageId = ref(route.params.imageId);

  const isUpdateModalOpen = ref(false);
  const updatedImageFile = ref(null);

  const isAdmin = computed(() => store.state.isStaff);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = computed(() => store.state.accessToken);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchCarImage = async () => {
    try {

      const response = await axios.get(
        `${BASE_API_URL}/cars/${carId.value}/images/${imageId.value}/`
      );

      if (response.status === 200) {
        const data = response.data;
        image.value = data;
      } else {
        errorMessage.value = 'Error fetching car image data';
        router.push({ name: 'ImagesList', params: { carId: carId.value } });
      }
    } catch (error) {
      errorMessage.value = 'Error fetching car image data';
      image.value = {};
      router.push({ name: 'ImagesList', params: { carId: carId.value } });
    }
  };

  watch(() => route.params, fetchCarImage, { immediate: true });

  const getImageUrl = (relativeUrl) => {
    if (relativeUrl) {
      const sanitizedRelativeUrl = relativeUrl.replace(/^\//, '');

      if (sanitizedRelativeUrl.startsWith('http') || sanitizedRelativeUrl.startsWith('https')) {
        return sanitizedRelativeUrl;
      } else {
        const fullUrl = `http://localhost:8000/${sanitizedRelativeUrl}`;
        return fullUrl;
      }
    } else {
      return 'https://via.placeholder.com/300x200';
    }
  };

  const deleteImage = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken.value}`,
      };

      const response = await axios.delete(
        `${BASE_API_URL}/cars/${carId.value}/images/${imageId.value}/`,
        { headers }
      );

      if (response.status === 204) {
        successMessage.value = 'Image deleted successfully';
        router.push({ name: 'ImagesList', params: { carId: carId.value }, query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = 'Error deleting image';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = 'Error deleting image';
      router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const updateImage = async () => {
    try {

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${accessToken.value}`,
      };

      const formData = new FormData();
      formData.append('image', updatedImageFile.value);

      const response = await axios.put(
        `${BASE_API_URL}/cars/${carId.value}/images/${imageId.value}/`,
        formData,
        { headers }
      );

      if (response.status === 200) {
        successMessage.value = 'Image updated successfully';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = 'Error updating image';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = 'Error updating image';
      router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const openUpdateModal = () => {
    isUpdateModalOpen.value = true;
  };

  const closeUpdateModal = () => {
    isUpdateModalOpen.value = false;
    updatedImageFile.value = null;
  };

  const handleFileChange = (event) => {
    updatedImageFile.value = event.target.files[0];
  };

  const submitUpdate = async () => {
    try {

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${accessToken.value}`,
      };

      const formData = new FormData();
      formData.append('image', updatedImageFile.value);

      const response = await axios.put(
        `${BASE_API_URL}/cars/${carId.value}/images/${imageId.value}/`,
        formData,
        { headers }
      );

      if (response.status === 200) {
        closeUpdateModal();
        successMessage.value = 'Image updated successfully';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = 'Error updating image';
        router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = 'Error updating image';
      router.push({ name: 'ImageDetail', params: { carId: carId.value, imageId: imageId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
  };

  const beforeRouteUpdate = (to, from, next) => {
    fetchCarImage();
    next();
  };

  onMounted(() => {
    fetchCarImage();
  });
</script>

<style>
/* Add your modal styling here */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
