<template>
  <div class="container mx-auto mt-24">
    <h1 class="text-4xl font-bold mb-4">Car Detail</h1>

    <div class="flex justify-end">
        <!-- Delete Car Button (for isStaff) -->
        <button v-if="isStaff" @click="deleteCar" class="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-4">
            Delete Car
        </button>

        <!-- Update Car Button (for isStaff) -->
        <button v-if="isStaff" @click="openUpdateModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4">
            Update Car
        </button>

        <!-- Book Car Button (for non-staff users) -->
        <router-link v-if="!isStaff" :to="{ name: 'BookingsList' }">
            <button class="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4">
                Book Car
            </button>
        </router-link>
    </div>


    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else>
      <div class="flex flex-wrap pt-8 items-center justify-center">
        <div class="flex flex-col w-full md:w-2/3 align-middle h-full">
          <div v-if="car.id" class="overflow-hidden border-b pb-4 pt-3 w-full md:w-96 h-60 md:h-auto rounded-lg">
            <router-link :to="{ name: 'ImagesList', params: { carId: car.id }}">
              <img
                :src="car.images && car.images.length > 0 ? car.images[0].image : ''"
                :alt="car.name"
                class="w-full h-full object-center rounded-lg"
              />
            </router-link>
          </div>

          <div class="pt-4 pl-2 md:w-2/3">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-semibold mb-2">
                {{ car.name }}
                <span class="text-lg font-medium">({{ car.model }})</span>
              </h2>
              <div class="flex pr-4">
                <span class="text-yellow-600 mr-1" v-for="star in car.stars" :key="star">
                  ★
                </span>
              </div>
            </div>
            <!-- Additional Car Details -->
            <div class="flex flex-col">
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/gear.png" alt="gear" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">{{ car.gearbox }}</p>
              </div>
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/user.png" alt="user" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">
                  {{ car.seat }}
                  <span class="text-gray-600 mr-1"> seats</span>
                </p>
              </div>
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/door.png" alt="door" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">
                  {{ car.door }}
                  <span class="text-gray-600 mr-1"> doors</span>
                </p>
              </div>
              <div class="flex items-center mt-2 mb-4">
                <img src="../../assets/img/dollar.svg" alt="dollar" class="w-5 h-5 mr-2" />
                <p class="text-green-500 font-semibold text-lg">
                  ${{ car.price }} per day
                </p>

              <div
                v-if="isUpdateModalOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
              >
                <div class="bg-white p-8 rounded shadow-md">
                  <h2 class="text-2xl font-semibold mb-4">Update Car Details</h2>

                  <div class="mb-4">
                    <label for="updateName" class="block text-gray-700 text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      v-model="updateCar.name"
                      type="text"
                      id="updateName"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateModel" class="block text-gray-700 text-sm font-bold mb-2">
                      Model
                    </label>
                    <input
                      v-model="updateCar.model"
                      type="text"
                      id="updateModel"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateGearbox" class="block text-gray-700 text-sm font-bold mb-2">
                      Gearbox
                    </label>
                    <input
                      v-model="updateCar.gearbox"
                      type="text"
                      id="updateGearbox"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateSeat" class="block text-gray-700 text-sm font-bold mb-2">
                      Seat
                    </label>
                    <input
                      v-model="updateCar.seat"
                      type="number"
                      id="updateSeat"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateDoor" class="block text-gray-700 text-sm font-bold mb-2">
                      Door
                    </label>
                    <input
                      v-model="updateCar.door"
                      type="number"
                      id="updateDoor"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updatePrice" class="block text-gray-700 text-sm font-bold mb-2">
                      Price
                    </label>
                    <input
                      v-model="updateCar.price"
                      type="number"
                      id="updatePrice"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="flex justify-end">
                    <button
                      @click="closeUpdateModal"
                      class="bg-gray-500 text-white px-4 py-2 rounded mr-4"
                    >
                      Cancel
                    </button>
                    <button
                      @click="updateCarDetails"
                      class="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
export default {
  name: "CarDetails",
  data() {
    return {
      car: {},
      updateCar: {},
      isStaff: false,
      isLoading: true,
      isUpdateModalOpen: false,
    };
  },
  methods: {
    async fetchCarDetails() {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/cars/${this.$route.params.carId}/`);

        if (response.ok) {
          const data = await response.json();
          this.car = data;
          this.isLoading = false;
        } else {
          console.error("Error fetching car details");
        }
      } catch (error) {
        console.error("Error fetching car details", error);
        throw error;
      }
    },
    async deleteCar() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
        const response = await fetch(`http://localhost:8000/api/v1/cars/${this.car.id}/`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.ok) {
          console.log("Car deleted successfully");
          this.$router.push({ name: 'CarsList' });
          // Optionally, you can navigate to another page or perform any other action
        } else {
          console.error("Error deleting car");
        }
      } catch (error) {
        console.error("Error deleting car", error);
      }
    },
    async updateCarDetails() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
        const response = await fetch(`http://localhost:8000/api/v1/cars/${this.car.id}/`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(this.updateCar),
        });

        if (response.ok) {
          console.log("Car updated successfully");
          this.closeUpdateModal();
          this.fetchCarDetails();
        } else {
          console.error("Error updating car");
        }
      } catch (error) {
        console.error("Error updating car", error);
      }
    },
    openUpdateModal() {
      this.updateCar = {
        name: this.car.name,
        model: this.car.model,
        gearbox: this.car.gearbox,
        seat: this.car.seat,
        door: this.car.door,
        price: this.car.price,
      };
      this.isUpdateModalOpen = true;
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
  },
  created() {
    this.fetchCarDetails();
    this.$store.dispatch('initializeApp').then(() => {
      this.isStaff = this.$store.state.isStaff;
    });
  },
};
</script>
