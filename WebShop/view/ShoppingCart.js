import { mapMutations, mapGetters, mapState } from 'vuex';

export default {
  name: 'ShoppingCart',
  template: String.raw`
    <button class="cart-button" @click="$router.push('/')">
      <i class="fas fa-arrow-left"></i> Zurück zum Shop
    </button>
    <h1>Warenkorb</h1>
    <table class="table" style="width: 100%; text-align: center;">
      <thead>
        <tr>
          <th style="width: 40%; padding-bottom: 10px;">Artikel</th>
          <th style="width: 15%; padding-bottom: 10px;">Anzahl</th>
          <th style="width: 15%; padding-bottom: 10px;">Preis Netto</th>
          <th style="width: 15%; padding-bottom: 10px;">MwSt</th>
          <th style="width: 15%; padding-bottom: 10px;">Preis Brutto</th>
        </tr>
      </thead>
      <tr>
        <td colspan="5" style="padding-bottom: 10px; border-bottom: 1px solid #a3a3a3;"></td>
      </tr>
      <tbody>
        <tr v-for="article in getArticlesInCart" :key="article.prodID">
          <td style="text-align: center;">{{ article.titel }}</td>
          <td style="text-align: center;">
            <button class="btn-increase" @click="removeOneFromCart(article.prodID)">
              <template v-if="article.amount > 1">-</template>
              <template v-else><i class="fas fa-trash"></i></template>
            </button>
            {{ article.amount }}
            <button class="btn-decrease" @click="addOneToCart(article.prodID)">+</button>
          </td>
          <td style="text-align: center;">{{ (article.amount * article.preis).toFixed(2) }} €</td>
          <td style="text-align: center;">{{ (article.amount * article.preis * MwStSatz).toFixed(2) }} €</td>
          <td style="text-align: center;">{{ (article.amount * article.preis * (1 + MwStSatz)).toFixed(2) }} €</td>
        </tr>
        <tr></tr>
        <td colspan="0" style="text-align: center; padding-top: 15px;">
          <strong>Gesamtbetrag:</strong>
        </td>
        <td colspan="1" style="text-align: center; padding-top: 15px;"></td>
        <td colspan="1" style="text-align: center; padding-top: 15px;">
          {{ sumNettoOfArticlesInCart.toFixed(2) }} €
        </td>
        <td colspan="1" style="text-align: center; padding-top: 15px;">
          {{ sumMwstOfArticlesInCart.toFixed(2) }} €
        </td>
        <td colspan="1" style="text-align: center; padding-top: 15px;">
          <strong>{{ sumBruttoOfArticlesInCart.toFixed(2)}} €</strong>
        </td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: center; margin-top: 30px;">
      <button class="btn-increase" style="width: auto; padding: 10px 20px;" @click="payment">
        Bezahlen
      </button>
    </div>
    `,
  
  computed: {
    ...mapState(['MwStSatz', '_articlesInCartMap']),
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
}