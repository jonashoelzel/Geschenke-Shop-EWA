import { mapState, mapMutations } from 'vuex';
import createAndAddProductsToBestellung from '../apis/create_bestellung_and_add_products.js';

export default {
  name: 'Shop',
  template: String.raw`
    <div>
      <h1>Shop</h1>
      <button v-if="isAdmin" class="cart-button" style="right: 250px;" @click="$router.push('/admin')">
        <i class="fas fa-user-shield"></i> Admin
      </button>
      <button v-if="!user" class="cart-button" style="right: 150px;" @click="$router.push('/login')">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>
      <button v-else class="cart-button" style="right: 150px;" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
      <button class="cart-button" @click="$router.push('/shopping-cart')">
        <i class="fas fa-shopping-cart"></i> Warenkorb
      </button>
      <!-- Search input field -->
      <input type="text" v-model="searchQuery" placeholder="Suche nach Artikeln..."
        style="margin-bottom: 1em; padding: 10px; width: 100%; max-width: 300px;"
        @input="onSearchQueryChange(searchQuery)">
      <div v-for="article in articlesFiltered" :key="article.prodID" style="margin-bottom: 1em;">
        <div v-if="article.bestand >= 1">
          <div>
            <img :src="article.bild" style="width: 150px; height: 150px;">
            <br>
            <strong>{{ article.titel }}</strong><br>
            {{ article.beschreibung }}<br>
            Preis: {{ (Number(article.preis) * (1 + MwStSatz)).toFixed(2) }} €
          </div>
          <div>
            <button @click="addOneToCart(article.prodID)"
              style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 15px; cursor: pointer;">
              Zum Warenkorb hinzufügen
            </button>
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