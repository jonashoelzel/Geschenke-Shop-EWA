import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Login',
  template: String.raw`
    <div>
      <h1>Login</h1>

      <!-- User Information -->
      <div v-if="user">
        <p>Welcome, {{ user.username }}!</p>
        <button @click="logout">Logout</button>
        <div v-if="user.isAdmin">
          <button @click="goToAdminPage">Go to Admin Page</button>
        </div>
        <button @click="$router.push('/')">
          <i class="fas fa-arrow-left"></i> Zurück zum Shop
        </button>
      </div>

      <!-- Registration Form -->
            <div v-else>
              <h2>Register</h2>
              <form @submit.prevent="register">
                <label>Username: <input v-model="registerForm.username" type="text" required minlength="3"></label><br>
                <label>Email: <input v-model="registerForm.email" type="email" required></label><br>
                <label>Password: <input v-model="registerForm.password" type="password" required minlength="5"></label><br>
                <button type="submit">Register</button>
              </form>
      
              <!-- Login Form -->
              <h2>Login</h2>
              <form @submit.prevent="login">
                <label>Email: <input v-model="loginForm.email" type="email" required></label><br>
                <label>Password: <input v-model="loginForm.password" type="password" required minlength="5"></label><br>
                <button type="submit">Login</button>
              </form>
            </div>
    </div>
  `,
  data() {
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
      },
      loginForm: {
        email: '',
        password: '',
      },
      apiUrl: './login_php/', // Replace with your actual backend API URL
    };
  },
  methods: {
    ...mapMutations(['setUser', 'clearUser']),
    async register() {
      try {
        const response = await fetch(`${this.apiUrl}register.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.registerForm),
        });

        if (response.status === 409) {
          alert('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
          return;
        }

        const data = await response.json();
        console.log('Server response:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
          this.setUserFromToken();
        }

        this.registerForm = {
          username: '',
          email: '',
          password: '',
        };
      } catch (error) {
        console.error('Error during registration:', error);
      }
    },
    async login() {
      try {
        const response = await fetch(`${this.apiUrl}login.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
        });

        if (response.status === 401) {
          alert('Ungültige E-Mailadresse oder Passwort eingegeben.');
          return;
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('token', data.token);
          this.setUserFromToken();
        }

        this.loginForm = {
          email: '',
          password: '',
        };
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.clearUser();
    },
    setUserFromToken() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.parseJwt(token);
        let isAdmin = false;

        if (decodedToken.is_admin === 1 || decodedToken.is_admin === true) {
          isAdmin = true;
        }

        const user = {
          username: decodedToken.username,
          email: decodedToken.email,
          isAdmin: isAdmin,
        };

        this.setUser(user);
      }
    },
    parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    },
    goToAdminPage() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to access this page.');
        return;
      }
      this.$router.push('/admin');
    },
  },
  created() {
    this.setUserFromToken();
  },
  computed: {
    ...mapState(['user']),
  },
};