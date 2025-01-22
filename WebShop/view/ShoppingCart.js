import { mapMutations, mapGetters, mapState } from 'vuex';

export default {
  name: 'ShoppingCart',
  template: String.raw`
    <div class="container mt-5">
      <button class="btn btn-secondary mb-3" @click="$router.push('/')">
        <i class="fas fa-arrow-left"></i> Zurück zum Shop
      </button>
      <h1>Warenkorb</h1>
      <table class="table table-bordered text-center">
        <thead class="thead-light">
          <tr>
            <th>Artikel</th>
            <th>Anzahl</th>
            <th>Preis Netto</th>
            <th>MwSt</th>
            <th>Preis Brutto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in getArticlesInCart" :key="article.prodID">
            <td>{{ article.titel }}</td>
            <td>
              <button class="btn btn-outline-secondary btn-sm" @click="removeOneFromCart(article.prodID)">
                <template v-if="article.amount > 1">-</template>
                <template v-else><i class="fas fa-trash"></i></template>
              </button>
              {{ article.amount }}
              <button class="btn btn-outline-secondary btn-sm" @click="addOneToCart(article.prodID)">+</button>
            </td>
            <td>{{ (article.amount * article.preis).toFixed(2) }} €</td>
            <td>{{ (article.amount * article.preis * MwStSatz).toFixed(2) }} €</td>
            <td>{{ (article.amount * article.preis * (1 + MwStSatz)).toFixed(2) }} €</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Gesamtbetrag:</strong></td>
            <td>{{ sumNettoOfArticlesInCart.toFixed(2) }} €</td>
            <td>{{ sumMwstOfArticlesInCart.toFixed(2) }} €</td>
            <td><strong>{{ sumBruttoOfArticlesInCart.toFixed(2) }} €</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-4">
        <button v-if="getArticlesInCart.length > 0" class="btn btn-primary" @click="payment">
          Bezahlen
        </button>
      </div>
    </div>
  `,
  computed: {
    ...mapState(['MwStSatz', '_articlesInCartMap', 'user']),
    ...mapGetters(['getArticlesInCart']),
    sumNettoOfArticlesInCart() {
      return this.$store.getters.getArticlesInCart.reduce((sum, article) => sum + article.amount * article.preis, 0);
    },
    sumMwstOfArticlesInCart() {
      return this.$store.getters.getArticlesInCart.reduce((sum, article) => sum + article.amount * article.preis * this.MwStSatz, 0);
    },
    sumBruttoOfArticlesInCart() {
      return this.$store.getters.getArticlesInCart.reduce((sum, article) => sum + article.amount * article.preis * (1 + this.MwStSatz), 0);
    },
  },
  methods: {
    ...mapMutations(['addOneToCart', 'removeOneFromCart']),
    async payment() {
      if (!this.user) {
        alert('Bitte loggen sie sich ein um ihre Bestellung abzuschließen.');
        this.$router.push('/login');
        return;
      }
      try {
        // Create line items for Stripe
        const lineItems = this.getArticlesInCart.map(article => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: article.titel,
            },
            unit_amount: Math.round(article.preis * 100), // Convert to cents
          },
          quantity: article.amount,
        }));

        // Create checkout session
        const response = await fetch('./stripe/create-checkout-session.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lineItems: lineItems,
            cartMap: encodeURIComponent(JSON.stringify(Array.from(this._articlesInCartMap))),
            user: encodeURIComponent(JSON.stringify(this.$store.state.user)),
          }),
        });

        if (response.error) {
          // Handle any errors from Stripe
          console.error('Stripe checkout error:', response.error);
          return;
        }

        const { sessionId, redirect, error, error_description } = await response.json();

        console.log(error, error_description);

        // Redirect to Stripe Checkout
        window.location.href = redirect;

      } catch (error) {
        console.error('Error creating checkout session:', error);
      }
    }
  }
};