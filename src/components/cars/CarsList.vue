<template>
  <div class="mt-24">
    <h1 class="text-4xl font-bold mb-4">Available Cars</h1>
    <div class="flex justify-end">
      <!-- Button to open the modal -->
      <button v-if="isStaff" @click="openModal" class="bg-blue-500 text-white p-2 rounded justify-end mr-24">Add New Car</button>
    </div>

    <!-- Modal for adding a new car -->
    <div v-if="isStaff && showModal" class="fixed inset-0 z-50 overflow-auto flex items-center justify-center" @click.self="closeModal">
      <div class="modal-content bg-white w-96 mx-auto p-6 rounded-lg shadow-lg" @click.stop>
        <span class="close absolute top-2 right-2 text-gray-600 cursor-pointer" @click="closeModal">&times;</span>

        <h2 class="text-2xl font-bold mb-4 flex justify-end">Add a New Car</h2>

        <!-- Form for adding a new car -->
        <form @submit.prevent="addCar" class="mb-8">
          <div class="flex flex-col mb-4">
            <label for="name" class="mb-2 text-lg font-semibold">Car Name</label>
            <input v-model="newCar.name" type="text" id="name" required class="border p-2" />
          </div>

          <div class="flex flex-col mb-4">
            <label for="model" class="mb-2 text-lg font-semibold">Car Model</label>
            <input v-model="newCar.model" type="text" id="model" required class="border p-2" />
          </div>

          <div class="flex flex-col mb-4">
            <label for="seat" class="mb-2 text-lg font-semibold">Number of Seats</label>
            <input v-model="newCar.seat" type="number" id="seat" required class="border p-2" />
          </div>

          <div class="flex flex-col mb-4">
            <label for="door" class="mb-2 text-lg font-semibold">Number of Doors</label>
            <input v-model="newCar.door" type="number" id="door" required class="border p-2" />
          </div>

          <div class="flex flex-col mb-4">
            <label for="gearbox" class="mb-2 text-lg font-semibold">Gearbox</label>
            <select v-model="newCar.gearbox" id="gearbox" required class="border p-2">
              <option value="M">Manual</option>
              <option value="A">Automatic</option>
            </select>
          </div>

          <div class="flex flex-col mb-4">
            <label for="price" class="mb-2 text-lg font-semibold">Price</label>
            <input
              v-model="newCar.price"
              type="text"
              id="price"
              required
              class="border p-2"
              pattern="\d+(\.\d{1,2})?"
              title="Enter a valid numeric value with up to two decimal places"
            />
          </div>

          <!-- Add other input fields for the remaining attributes of the Car model -->

          <button
                class="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Add Car
              </button>
              <button
                @click="closeModal"
                class="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
              >
                Cancel
              </button>
        </form>
      </div>
    </div>


    <!-- Retrieve cars list -->
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else>
    <div class="container mx-auto mt-8 flex flex-wrap pt-16">
      <router-link
        v-for="car in cars"
        :key="car.id"
        :to="{ name: 'CarDetail', params: { carId: car.id } }"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4 mb-8"
      >
        <div class="bg-white rounded-lg border">
          <div class="h-40 overflow-hidden border-b pb-4 pt-2">
            <img
              :src="car.images.length > 0 ? car.images[0].image : ''"
              :alt="car.name"
              class="w-full h-full object-contain object-center"
            />
          </div>

          <div class="flex flex-col">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-semibold mb-2">
                {{ car.name }}
                <span class="text-lg font-medium">({{ car.model }})</span>
              </h2>
              <div class="flex pr-4">
                <span class="text-gray-600 mr-1">
                  <router-link :to="{ name: 'ReviewsList', params: { carId: car.id }}" class="text-blue-500 mt-3 ml-4 hover:underline">
                    View Reviews
                  </router-link>
                </span>
              </div>
            </div>
            <!-- Book Now and View Reviews buttons side by side -->
            <div class="flex">
              <button class="bg-green-500 text-white px-4 py-2 rounded mt-2 mr-4">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </router-link>
      </div>
  </div>
  </div>
</template>




<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  import config from '@/services/env.config';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const cars = ref([]);
  const newCar = reactive({
    name: '',
    model: '',
    seat: 0,
    door: 0,
    gearbox: '',
    price: 0.0,
  });

  const showModal = ref(false);
  const isLoading = ref(true);

  const successMessage = ref(route.query.successMessage);
  const errorMessage = ref(route.query.errorMessage);

  const BASE_API_URL = config.VUE_APP_BASE_API_URL;

  const isStaff = computed(() => store.state.isStaff);


  const fetchCars = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/cars/`);
      cars.value = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      errorMessage.value = 'Error fetching data';
    } finally {
      isLoading.value = false;
    }
  };

  const addCar = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      };

      await axios.post(`${BASE_API_URL}/cars/`, newCar, { headers });
      fetchCars();
      successMessage.value = 'Car added successfully';
      closeModal();
      router.push({ name: 'CarDetail', params: { carId: cars.value[cars.value.length - 1].id }, query: { successMessage: successMessage.value } });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'Unauthorized or expired token';
        router.push({ name: 'Login', query: { errorMessage: errorMessage.value } });
      } else {
        errorMessage.value = 'Error adding car';
      }
    }
  };

  const openModal = () => {
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
  };

  onMounted(async () => {
    await store.dispatch('intializeApp');
    fetchCars();
  });

</script>
