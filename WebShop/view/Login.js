import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Login',
  template: String.raw`
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <h2>Login</h2>
          <form @submit.prevent="login">
            <div class="form-group">
              <label>Email:</label>
              <input v-model="loginForm.email" type="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Passwort:</label>
              <input v-model="loginForm.password" type="password" class="form-control" required minlength="5">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
        <div class="col-md-6">
          <div v-if="user">
            <h2>Welcome, {{ user.username }}!</h2>
            <button @click="logout" class="btn btn-danger">Logout</button>
            <div v-if="user.isAdmin" class="mt-3">
              <button @click="goToAdminPage" class="btn btn-secondary">Go to Admin Page</button>
            </div>
            <button @click="$router.push('/')" class="btn btn-secondary mt-3">
              <i class="fas fa-arrow-left"></i> Zurück zum Shop
            </button>
          </div>
          <div v-else>
            <h2>Registrieren</h2>
            <form @submit.prevent="register">
              <div class="form-group">
                <label>Username:</label>
                <input v-model="registerForm.username" type="text" class="form-control" required minlength="3">
              </div>
              <div class="form-group">
                <label>Email:</label>
                <input v-model="registerForm.email" type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Passwort:</label>
                <input v-model="registerForm.password" type="password" class="form-control" required minlength="5">
              </div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
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
          alert('Benutzer erfolgreich erstellt!');
          this.$router.push('/');
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
          this.$router.push('/');
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
          id: decodedToken.kundenID,
          username: decodedToken.username,
          email: decodedToken.email,
          isAdmin: isAdmin,
        };

        console.log('User from token:', user);

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
    if (this.user) {
      this.$router.push('/');
    }
  },
  computed: {
    ...mapState(['user']),
  },
};