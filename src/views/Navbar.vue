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
      </div>
      <div class="flex items-center">
        <template v-if="!isAuthenticated">
          <button
            @click="showLoginModal"
            class="text-black border border-green-500 px-4 py-2 rounded focus:outline-none"
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
                <router-link
                  to="/my-bookings"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <img
                    src="../assets/img/manage.svg"
                    alt="manage icon"
                    class="h-4 w-4 mr-2"
                  />
                  My Bookings
                </router-link>
                <router-link
                  to="/my-account"
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
          <p
            v-if="loginError"
            class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2"
          >
            {{ loginError }}
          </p>
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
          <div class="mb-4">
            <label for="registerConfirmPassword" class="block text-gray-700"
              >Confirm Password</label
            >
            <input
              type="password"
              id="registerConfirmPassword"
              v-model="registerData.confirmPassword"
              class="w-full p-2 border rounded"
              :required="formSubmitted && !registerData.confirmPassword"
            />
            <!-- Error message for confirm password -->
            <p
              v-if="formSubmitted && !registerData.confirmPassword"
              class="text-red-500"
            >
              Confirm Password is required
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

<script>
export default {
  name: "CarRentalNavbar",
  data() {
    return {
      showModal: false,
      showRegister: false,
      showDropdown: false,

      registerData: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },

      loginData: {
        username: "",
        password: "",
      },

      loginError: "",
      formSubmitted: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    getUsername() {
      return this.$store.state.username;
    },
  },
  methods: {
    showLoginModal() {
      this.showModal = true;
      this.showRegister = false;
    },
    showRegisterForm() {
      this.showRegister = true;
    },
    showLoginForm() {
      this.showRegister = false;
    },
    closeModal() {
      this.showModal = false;
      this.showRegister = false;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown() {
      this.showDropdown = false;
    },

    async submitForm() {
      this.formSubmitted = true;
      if (this.showRegister) {
        await this.register();
      } else {
        await this.login();
      }
    },
    async register() {
      try {
        this.loginError = "";

        if (
          !this.registerData.first_name ||
          !this.registerData.last_name ||
          !this.registerData.username ||
          !this.registerData.email ||
          !this.registerData.password ||
          this.registerData.password !== this.registerData.confirmPassword
        ) {
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/users/', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.registerData),
        });

        if (response.ok) {
          console.log("Registration successful");
          await this.login();
          this.closeModal();
        } else {
          console.error("Registration failed");
        }
      } catch (error) {
        console.error("Error during registration", error);
        this.loginError = "Error during Sign Up";
      }
    },

    async login() {
      try {
        this.loginError = "";

        if (!this.loginData.username || !this.loginData.password) {
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/jwt/create/', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.loginData),
        });

        if (response.ok) {
          const data = await response.json();
          const accessToken = data.access;
          const refreshToken = data.refresh;
          const username = this.loginData.username;

          const userIdResponse = await fetch(
            `http://localhost:8000/api/v1/auth/users/?search=${username}`,
            {
              headers: {
                Authorization: `JWT ${accessToken}`,
              },
            }
          );
          const userData = await userIdResponse.json();
          const userId = userData[0].id;

          this.$store.commit("setAuthentication", {
            isAuthenticated: true,
            accessToken,
            refreshToken,
            username,
          });
          this.$store.commit("setUserId", userId);

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("username", username);
          localStorage.setItem("userId", userId);

          this.closeModal();
          console.log("Login successful");
        } else {
          this.loginError = "Invalid username or password";
        }
      } catch (error) {
        console.error("Error during login", error);
        this.loginError = "Error during login";
      }
    },

    async logout() {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await fetch(
          'http://localhost:8000/api/v1/auth/jwt/logout/',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${refreshToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (response.ok) {
          this.$store.commit("setAuthentication", {
            isAuthenticated: false,
            accessToken: null,
            username: null,
          });

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("username");
          localStorage.removeItem("id");
          this.loginData.username = "";
          this.loginData.password = "";

          this.$router.push({ name: "Home" });
          console.log("Logout successful");
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout", error);
      }
    },

    async bookNow() {
      this.$emit("book-now");
    },
  },
};
</script>
