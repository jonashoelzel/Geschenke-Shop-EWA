import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Shop',
  template: String.raw`
    <div>
    <h1>Shop</h1>
    <button class="cart-button" style="right: 150px;" @click="$router.push('/admin')">
      <i class="fas fa-user-shield"></i> Admin
    </button>
    <button class="cart-button" @click="$router.push('/shopping-cart')">
      <i class="fas fa-shopping-cart"></i> Warenkorb
    </button>
    <!-- Search input field -->
    <input type="text" v-model="searchQuery" placeholder="Suche nach Artikeln..."
      style="margin-bottom: 1em; padding: 10px; width: 100%; max-width: 300px;"
      @input="onSearchQueryChange(searchQuery)">
    <div v-for="article in articlesFiltered" :key="article.ProduktID" style="margin-bottom: 1em;">
      <div>
        <img :src="article.LinkGrafikdatei" style="width: 150px; height: 150px;">
        <br>
        <strong>{{ article.Produkttitel }}</strong><br>
        Lagerbestand: {{ article.Lagerbestand }}<br>
        Preis: {{ Number(article.PreisBrutto).toFixed(2) }} €
      </div>
      <div>
        <button @click="addOneToCart(article.ProduktID)"
          style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 15px; cursor: pointer;">
          Zum Warenkorb hinzufügen
        </button>
      </div>
    </div>
    </div>
    `,
  created() {
    this.fetchArticles();
  },
  computed: mapState(['articlesFiltered']),
  methods: {
    ...mapMutations(['fetchArticles', 'onSearchQueryChange', 'addOneToCart'])
  }
}
