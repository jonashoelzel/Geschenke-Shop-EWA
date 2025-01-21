import { mapState, mapMutations } from 'vuex';
import createAndAddProductsToBestellung from '../apis/create_bestellung_and_add_products.js';

export default {
  name: 'Shop',
  template: String.raw`
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Shop</h1>
        <div>
          <button v-if="isAdmin" class="btn btn-secondary mr-2" @click="$router.push('/admin')">
            <i class="fas fa-user-shield"></i> Admin
          </button>
          <button v-if="!user" class="btn btn-primary mr-2" @click="$router.push('/login')">
            <i class="fas fa-sign-in-alt"></i> Login
          </button>
          <button v-else class="btn btn-danger mr-2" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
          <button class="btn btn-info" @click="$router.push('/shopping-cart')">
            <i class="fas fa-shopping-cart"></i> Warenkorb
          </button>
        </div>
      </div>
      <!-- Search input field -->
      <div class="input-group mb-3">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Suche nach Artikeln..."
          @input="onSearchQueryChange(searchQuery)">
      </div>
      <div class="row">
        <div v-for="article in articlesFiltered" :key="article.prodID" class="col-md-4 mb-4">
          <div class="card h-100">
            <img :src="article.bild" class="card-img-top" alt="Artikelbild" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">{{ article.titel }}</h5>
              <p class="card-text">{{ article.beschreibung }}</p>
              <p class="card-text"><strong>Preis: {{ (Number(article.preis) * (1 + MwStSatz)).toFixed(2) }} €</strong></p>
              <button v-if="article.bestand >= 1" @click="addOneToCart(article.prodID)" class="btn btn-primary">
                Zum Warenkorb hinzufügen
              </button>
              <p v-else class="text-danger">Nicht auf Lager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  created() {
    this.fetchArticles();
  },
  computed: {
    ...mapState(['articlesFiltered', 'user', 'MwStSatz']),
    isAdmin() {
      return this.user && this.user.isAdmin;
    }
  },
  methods: {
    ...mapMutations(['fetchArticles', 'onSearchQueryChange', 'addOneToCart', 'clearUser']),
    logout() {
      localStorage.removeItem('token');
      this.clearUser();
      this.$router.push('/login');
    }
  },
  async mounted() {
    // Check for payment status in URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    const cart = urlParams.get('cart');
    const user = urlParams.get('user');
    if (cart) {
      try {
        const cartMap = JSON.parse(decodeURIComponent(cart));
        this.$store.commit('setCartFromURL', cartMap);
      } catch (e) {
        console.error('Error restoring cart:', e);
      }
    }

    if (user) {
      this.$store.commit('setUser', JSON.parse(decodeURIComponent(user)));
    }
    
    if (paymentStatus === 'success') {
      const cartProdukte = Array.from(this.$store.state._articlesInCartMap.entries()).map(([prodID, menge]) => ({ prodID, menge }));

      await createAndAddProductsToBestellung(this.user.id, cartProdukte);
      // Show success message and clear cart
      this.$store.commit('clearCart');
      alert('Payment successful!');
    } else if (paymentStatus === 'cancelled') {
      // Optionally show a message when payment is cancelled
      alert('Payment cancelled');
    }

    // Clean up URL
    if (paymentStatus) {
      this.$router.replace(this.$route.path);
    }
  }
};