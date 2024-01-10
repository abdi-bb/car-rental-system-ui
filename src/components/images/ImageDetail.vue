<template>
  <div class="mt-24">
    <h2 class="text-2xl font-semibold mb-4">Car Image Detail</h2>
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
        <input type="file" @change="handleFileChange" />
        <button @click="submitUpdate" class="mr-2">Update</button>
        <button @click="closeUpdateModal" class="ml-2">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: {},
      isUpdateModalOpen: false,
      updatedImageFile: null,
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.isStaff;
    },
  },
  watch: {
    '$route.params': {
      handler: 'fetchCarImage',
      immediate: true,
    },
  },
  methods: {
    async fetchCarImage() {
      try {
        const { carId, imageId } = this.$route.params;
        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${carId}/images/${imageId}/`);
        this.image = await response.json();
      } catch (error) {
        console.error('Error fetching car image:', error);
      }
    },
    getImageUrl(relativeUrl) {
      return relativeUrl && relativeUrl.startsWith('http') ? relativeUrl : `http://localhost:8000/${relativeUrl}`;
    },
    async deleteImage() {
      try {
        const { carId, imageId } = this.$route.params;
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          Authorization: `JWT ${accessToken}`,
        };

        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${carId}/images/${imageId}/`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.ok) {
          console.log('Image deleted successfully');
          this.fetchCarImage();
          // Redirect to the car detail page after deletion
          this.$router.push({ name: 'CarDetail', params: { carId: carId } });
        } else {
          console.error('Image deletion failed');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    },
    async updateImage() {
      try {
        const { carId, imageId } = this.$route.params;
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          Authorization: `JWT ${accessToken}`,
        };

        // Assuming you have an input field for selecting a new image file
        const formData = new FormData();
        formData.append('image', this.updatedImageFile);

        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${carId}/images/${imageId}/`, {
          method: 'PUT',
          headers: headers,
          body: formData,
        });

        if (response.ok) {
          console.log('Image updated successfully');
          // Fetch the updated data before navigating to the new route
          this.fetchCarImage();
          // Redirect to the image detail page after updating
          this.$router.push({ name: 'ImageDetail', params: { carId: carId, imageId: imageId } });
        } else {
          console.error('Image update failed');
        }
      } catch (error) {
        console.error('Error updating image:', error);
      }
    },
    openUpdateModal() {
      this.isUpdateModalOpen = true;
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
      this.updatedImageFile = null;
    },
    handleFileChange(event) {
      this.updatedImageFile = event.target.files[0];
    },
    async submitUpdate() {
      try {
        const { carId, imageId } = this.$route.params;
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          Authorization: `JWT ${accessToken}`,
        };

        // Assuming you have an input field for selecting a new image file
        const formData = new FormData();
        formData.append('image', this.updatedImageFile);

        const response = await fetch(`http://localhost:8000/api/v1/cars/${carId}/images/${imageId}/`, {
          method: 'PUT',
          headers: headers,
          body: formData,
        });
        if (response.ok) {
          console.log('Image updated successfully');
          // Fetch the updated data before navigating to the new route
          this.fetchCarImage();
          // Redirect to the image detail page after updating
          this.$router.push({ name: 'ImageDetail', params: { carId: carId, imageId: imageId } });
          this.closeUpdateModal();
        } else {
          console.error('Image update failed');
        }
      } catch (error) {
        console.error('Error updating image:', error);
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    // This hook is called when the route parameters change
    // Use it to refresh the data when the user navigates back from the delete action
    this.fetchCarImage();
    next();
  },
};
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
