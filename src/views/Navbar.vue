<template>
  <nav class="p-4 border-b border-gray-200 fixed w-full top-0 bg-white">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/">
          <img src="../assets/img/logo.png" alt="Company Logo" class="h-8 w-8 mr-2" />
        </router-link>
        <router-link to="/">
          <span class="text-black text-lg font-semibold">WheelsOnRent</span>
        </router-link>


        <!--For Admin-->
        <template v-if="isAdmin">
          <div class="flex items-center">
            <router-link to="/users">
              <button
                class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none transition duration-300 ease-in-out hover:bg-green-500 hover:text-white mr-8 ml-8"
              >
                Users
              </button>
            </router-link>
            <router-link to="/cars">
              <button
                class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none transition duration-300 ease-in-out hover:bg-green-500 hover:text-white ml-8"
              >
                Cars
              </button>
            </router-link>
          </div>
        </template>
        <template v-else-if="isAuthenticated">
          <div class="flex items-center">
            <router-link to="/cars">
              <button
                class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none transition duration-300 ease-in-out hover:bg-green-500 hover:text-white mr-8 ml-8"
              >
                Cars
              </button>
            </router-link>
          </div>
        </template>
      </div>

        
      <div class="flex items-center">
        <template v-if="!isAuthenticated">
          <router-link to="/login">
            <button
              class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none transition duration-300 ease-in-out hover:bg-green-500 hover:text-white mr-8"
            >
              Sign In
            </button>
          </router-link>
          </template>


        <template v-else>
          <div class="relative inline-block text-left">
            <button
              @click="toggleDropdown"
              type="button"
              class="focus:outline-none"
            >
              <div
                class="relative w-20 h-10 border rounded-r-2xl rounded-l-2xl p-2 flex justify-between items-center"
              >
                <div>
                  <img
                    src="../assets/img/more.png"
                    alt="User"
                    class="w-5 h-5 text-green-500"
                  />
                </div>
                <div
                  class="absolute inset-0 flex items-center justify-end pr-2"
                >
                  <div
                    class="w-8 h-8 border rounded-full flex items-center justify-center"
                  >
                    <img
                      src="../assets/img/user.png"
                      alt="User"
                      class="w-5 h-5 text-green-500"
                    />
                  </div>
                </div>
              </div>
            </button>
            <!-- Dropdown menu -->
            <div
              v-show="showDropdown"
              @click="closeDropdown"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <div v-if="!isAdmin">
                  <router-link
                    to="/bookings"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <img
                      src="../assets/img/manage.svg"
                      alt="manage icon"
                      class="h-4 w-4 mr-2"
                    />
                    My Bookings
                  </router-link>
                </div>
                <router-link
                  :to="{ name: 'Me' }"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <img src="../assets/img/user.png" alt="user icon" class="h-4 w-4 mr-2" />
                  My Account
                </router-link>
                <a
                  @click="logout"
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <img
                    src="../assets/img/logout.svg"
                    alt="logout icon"
                    class="h-4 w-4 mr-2"
                  />
                  Logout</a
                >
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { computed, reactive, ref, watch, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import axios from "axios";

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const showDropdown = ref(false);

  const loginData = reactive({
    username: "",
    password: "",
  });

  const successMessage = ref(route.query.successMessage || "");
  const errorMessage = ref(route.query.errorMessage || "");

  const isAuthenticated = computed(() => store.state.isAuthenticated);
  const isStaff = computed(() => store.state.isStaff);
  const isAdmin = computed(() => isStaff.value && isAuthenticated.value);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;


  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const closeDropdown = () => {
    showDropdown.value = false;
  };

  const logout = async () => {
    try {
      clearMessages();

      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${BASE_API_URL}/auth/jwt/logout/`,
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `JWT ${refreshToken}`,
          },
        }
      );

      if (response.status === 200) {
        store.commit("setAuthentication", {
          isAuthenticated: false,
          accessToken: null,
          username: null,
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        loginData.username = "";
        loginData.password = "";

        successMessage.value = "Logout successful";
        router.push({ name: "Home" });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      console.error("Error during logout", error);
    }
  };

  // Clear success and error messages
  const clearMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";

    router.replace({ query: {} });
  };


</script>
