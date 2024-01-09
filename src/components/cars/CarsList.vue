<template>
  <div class="mt-24">
    <h1 class="text-4xl font-bold mb-4">Available Cars</h1>

    <!-- Button to open the modal -->
    <button v-if="isStaff" @click="openModal" class="bg-blue-500 text-white p-2 rounded">Add New Car</button>

    <!-- Modal for adding a new car -->
    <div v-if="isStaff && showModal" class="fixed inset-0 z-50 overflow-auto flex items-center justify-center" @click.self="closeModal">
      <div class="modal-content bg-white w-96 mx-auto p-6 rounded-lg shadow-lg" @click.stop>
        <span class="close absolute top-2 right-2 text-gray-600 cursor-pointer" @click="closeModal">&times;</span>

        <h2 class="text-2xl font-bold mb-4">Add a New Car</h2>

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

          <button type="submit" class="bg-blue-500 text-white p-2 rounded">Add Car</button>
        </form>
      </div>
    </div>


    <!-- Retrieve cars list -->
    <div class="container mx-auto mt-8 flex flex-wrap pt-16">
      <router-link
        v-for="car in cars"
        :key="car.id"
        :to="{ name: 'CarDetail', params: { id: car.id, name: car.name } }"
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

          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-base font-semibold">{{ car.name }}({{ car.model }})</h2>
              <!-- <p class="text-gray-600 mb-2">{{ car.gearbox }}</p> -->

              <p class="text-black font-semibold text-sm">
                ${{ car.price }} <span class="font-normal">/day</span>
              </p>
            </div>

            <!-- View Reviews link inside the loop -->
            <router-link :to="{ name: 'ReviewsList', params: { carId: car.id }}" class="text-blue-500 hover:underline">
              View Reviews
            </router-link>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>




<script>
import axios from 'axios';
import { refreshToken } from '@/services/refresh.token';

export default {
  name: 'CarsList',
  components: {},
  data() {
    return {
      cars: [],
      newCar: {
        name: '',
        model: '',
        seat: 0,
        door: 0,
        gearbox: '',
        price: 0.0,
      },
      showModal: false,
      isStaff: false,
    };
  },
  methods: {
    fetchCars() {
      axios.get('http://127.0.0.1:8000/api/v1/cars/')
        .then(response => {
          this.cars = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    async addCar() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };

        await axios.post('http://127.0.0.1:8000/api/v1/cars/', this.newCar, { headers });

        // If the request is successful, update the cars list and reset the form
        console.log('Car added successfully');
        this.fetchCars();
        this.newCar = {
          name: '',
          model: '',
          seat: 0,
          door: 0,
          gearbox: '',
          price: 0.0,
        };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, try refreshing the token
          try {
            const newAccessToken = await refreshToken(this.$store);
            // Retry the original request with the new access token
            await this.addCarWithToken(newAccessToken);
          } catch (refreshError) {
            // Token refresh failed, handle accordingly
            console.error('Token refresh failed:', refreshError);
          }
        } else {
          // Handle other errors
          console.error('Error adding car:', error);
        }
      }
    },

    async addCarWithToken(newAccessToken) {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${newAccessToken}`,
        };

        await axios.post('http://127.0.0.1:8000/api/v1/cars/', this.newCar, { headers });

        // If the request is successful, update the cars list and reset the form
        console.log('Car added successfully');
        this.fetchCars();
        this.newCar = {
          name: '',
          model: '',
          seat: 0,
          door: 0,
          gearbox: '',
          price: 0.0,
        };
      } catch (error) {
        // Handle errors in the retry request if needed
        console.error('Error adding car with new token:', error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
  created() {
    this.fetchCars();
    this.$store.dispatch('initializeApp').then(() => {
      this.isStaff = this.$store.state.isStaff;
      console.log('isStaff:', this.isStaff);
  });
  },
};
</script>


<style></style>