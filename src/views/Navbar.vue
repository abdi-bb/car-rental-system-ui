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
          <button
            @click="showLoginModal"
            class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none transition duration-300 ease-in-out hover:bg-green-500 hover:text-white"
          >
            Sign In
          </button>
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
                  :to="{ name: 'Me', params: { id: $store.state.userId } }"
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
    <!-- Login Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded shadow-md">
        <!-- Login Form -->
        <form v-if="!showRegister">
          <h2
            class="text-2xl font-semibold mb-4 col-span-full flex items-center justify-between"
          >
            Login
            <button @click="closeModal" class="bg-white text-red-800 px-4 py-2">
              x
            </button>
          </h2>
          <!-- Error message for login failure -->
          <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
            <div class="flex items-center justify-between">
              <span>{{ errorMessage }}</span>
              <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
                X
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label for="username" class="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              v-model="loginData.username"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !loginData.username"
            />
            <!-- Error message for username -->
            <p v-if="formSubmitted && !loginData.username" class="text-red-500">
              Username is required
            </p>
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              v-model="loginData.password"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !loginData.password"
            />
            <!-- Error message for password -->
            <p v-if="formSubmitted && !loginData.password" class="text-red-500">
              Password is required
            </p>
          </div>
          <button
            @click.prevent="submitForm"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <!-- Toggle to Register -->
          <p class="mt-4 text-sm">
            Don't have an account?
            <a @click="showRegisterForm" href="#" class="text-blue-500"
              >Register</a
            >
          </p>
        </form>

        <!-- Register Form -->
        <form
          v-if="showRegister"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <h2
            class="text-2xl font-semibold mb-4 col-span-full flex items-center justify-between"
          >
            Register
            <button @click="closeModal" class="bg-white text-red-800 px-4 py-2">
              x
            </button>
          </h2>

          <!-- Error message for registration failure -->
          <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
            <div class="flex items-center justify-between">
              <span>{{ errorMessage }}</span>
              <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
                X
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label for="registerFirstName" class="block text-gray-700"
              >First Name</label
            >
            <input
              type="text"
              id="registerFirstName"
              v-model="registerData.first_name"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.first_name"
            />
            <!-- Error message for first name -->
            <p
              v-if="formSubmitted && !registerData.first_name"
              class="text-red-500"
            >
              First Name is required
            </p>
          </div>
          <div class="mb-4">
            <label for="registerLastName" class="block text-gray-700"
              >Last Name</label
            >
            <input
              type="text"
              id="registerLastName"
              v-model="registerData.last_name"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.last_name"
            />
            <!-- Error message for last name -->
            <p
              v-if="formSubmitted && !registerData.last_name"
              class="text-red-500"
            >
              Last Name is required
            </p>
          </div>
          <div class="mb-4">
            <label for="registerUsername" class="block text-gray-700"
              >Username</label
            >
            <input
              type="text"
              id="registerUsername"
              v-model="registerData.username"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.username"
            />
            <!-- Error message for username -->
            <p
              v-if="formSubmitted && !registerData.username"
              class="text-red-500"
            >
              Username is required
            </p>
          </div>
          <div class="mb-4">
            <label for="registerEmail" class="block text-gray-700">Email</label>
            <input
              type="email"
              id="registerEmail"
              v-model="registerData.email"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.email"
            />
            <!-- Error message for email -->
            <p v-if="formSubmitted && !registerData.email" class="text-red-500">
              Email is required
            </p>
          </div>
          <div class="mb-4">
            <label for="registerPhone" class="block text-gray-700"
              >Phone Number</label>
            <input
              type="text"
              id="registerPhone"
              v-model="registerData.phone_number"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.phone_number"
            />
            <!-- Error message for phone number -->
            <p
              v-if="formSubmitted && !registerData.phone_number"
              class="text-red-500">
              Phone Number is required
              </p>
          </div>
          <div class="mb-4">
            <label for="registerPassword" class="block text-gray-700"
              >Password</label
            >
            <input
              type="password"
              id="registerPassword"
              v-model="registerData.password"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.password"
            />
            <!-- Error message for password -->
            <p
              v-if="formSubmitted && !registerData.password"
              class="text-red-500"
            >
              Password is required
            </p>
          </div>
          <button
            @click.prevent="submitForm"
            class="bg-green-500 text-white px-4 py-2 rounded col-span-full"
          >
            Register
          </button>
          <!-- Toggle to Login -->
          <p class="mt-4 text-sm col-span-full">
            Already have an account?
            <a @click="showLoginForm" href="#" class="text-blue-500">Login</a>
          </p>
        </form>
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

  const showModal = ref(false);
  const showRegister = ref(false);
  const showDropdown = ref(false);

  const registerData = reactive({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const loginData = reactive({
    username: "",
    password: "",
  });

  const loginError = ref("");
  const formSubmitted = ref(false);

  const successMessage = ref(route.query.successMessage || "");
  const errorMessage = ref(route.query.errorMessage || "");

  const isAuthenticated = computed(() => store.state.isAuthenticated);
  const isStaff = computed(() => store.state.isStaff);
  const isAdmin = computed(() => isStaff.value && isAuthenticated.value);
  // const username = computed(() => store.state.username);
  // const userId = computed(() => store.state.userId);
  
  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const showLoginModal = () => {
    showModal.value = true;
    showRegister.value = false;
  };

  const showRegisterForm = () => {
    showRegister.value = true;
  };

  const showLoginForm = () => {
    showRegister.value = false;
  };

  const closeModal = () => {
    showModal.value = false;
    showRegister.value = false;
  };

  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const closeDropdown = () => {
    showDropdown.value = false;
  };

  const submitForm = async () => {
    formSubmitted.value = true;
    if (showRegister.value) {
      await register();
    } else {
      await login();
    }
  };

  const register = async () => {
    try {
      clearMessages();

      if (
        !registerData.first_name ||
        !registerData.last_name ||
        !registerData.username ||
        !registerData.email ||
        !registerData.phone_number ||
        !registerData.password
      ) {
        console.error("All fields are required for registration.");
        errorMessage.value = "All fields are required for registration.";
        throw new Error("All fields are required for registration.");
      }

      const response = await axios.post(
        `${BASE_API_URL}/auth/users/`,
        registerData
      );

      if (response.status === 201) {
        console.log("Registration successful");
        successMessage.value = "Registration successful";
        showLoginForm();

        // Clear form data
        registerData.first_name = "";
        registerData.last_name = "";
        registerData.username = "";
        registerData.email = "";
        registerData.phone_number = "";
        registerData.password = "";

        closeModal();
      } else {
        console.error("Registration failed");
        errorMessage.value = "Registration failed";
        throw new Error("Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
        const responseData = error.response.data;

        if (responseData.password) {
          errorMessage.value = responseData.password[0];
        } else if (responseData.username) {
          console.error(responseData.username)
          errorMessage.value = responseData.username[0];
        }
      } else {
        errorMessage.value = "Unexpected error during registration";
        console.error("Error during registration", error);
      }
    }
  };

  const login = async () => {
    try {
      clearMessages();

      if (!loginData.username || !loginData.password) {
        return;
      }

      const response = await axios.post(
        `${BASE_API_URL}/auth/jwt/create/`,
        loginData
      );

      if (response.status === 200) {
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;
        const username = loginData.username;

        const userIdResponse = await axios.get(
          `${BASE_API_URL}/auth/users/?search=${username}`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
            },
          }
        );
        const userData = userIdResponse.data;
        const userId = userData[0].id;

        store.commit("setAuthentication", {
          isAuthenticated: true,
          accessToken,
          refreshToken,
          username,
        });
        store.commit("setUserId", userId);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);

        closeModal();
        console.log("Login successful");

        successMessage.value = "Login successful";
        window.location.reload();
      } else {
        loginError.value = "Invalid username or password";
        errorMessage.value = "Invalid username or password";
      }
    } catch (error) {
      console.error("Error during login", error);
      loginError.value = "Error during login";
      errorMessage.value = "Invalid username or password";
    }
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

  const logoutFromOutside = () => {
    logout();
  };

  const bookNow = () => {
    router.push({ name: "Bookings" });
  };

  // Clear success and error messages
  const clearMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";

    router.replace({ query: {} });
  };


</script>
