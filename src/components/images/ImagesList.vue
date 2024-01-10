<template>
  <div class="mt-24">
    <h2 class="text-2xl font-semibold mb-4">Car Images List</h2>
    
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
        :to="{ name: 'ImageDetail', params: { carId: this.$route.params.carId, imageId: image.id } }"
        class="group relative overflow-hidden rounded-lg border border-gray-300 transition-transform duration-300 transform hover:scale-105"
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

<script>
export default {
  data() {
    return {
      carImages: [],
      imageFile: null,
    };
  },
  computed: {
    isStaff() {
      console.log(this.$store.state.isStaff);
      return this.$store.state.isStaff;
    },
  },
  watch: {
    '$route.params.carId': {
      handler: 'fetchCarImages',
      immediate: true,
    },
  },
  methods: {
    async fetchCarImages() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/images/`);
        this.carImages = await response.json();
      } catch (error) {
        console.error('Error fetching car images:', error);
      }
    },
    getImageUrl(relativeUrl) {
      return relativeUrl.startsWith('http') ? relativeUrl : `http://localhost:8000/${relativeUrl}`;
    },
    async uploadImage() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          Authorization: `JWT ${accessToken}`,
        };

        const formData = new FormData();
        formData.append('image', this.imageFile);

        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${this.$route.params.carId}/images/`, {
          method: 'POST',
          headers: headers,
          body: formData,
        });

        if (response.ok) {
          console.log('Image uploaded successfully');
          const uploadedImage = await response.json();

          this.$router.push({ name: 'ImageDetail', params: { carId: this.$route.params.carId, imageId: uploadedImage.id } });
        } else {
          console.error('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    },
    handleFileChange(event) {
      this.imageFile = event.target.files[0];
    },
  },
};
</script>

<style>
</style>
