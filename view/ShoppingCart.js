import { mapMutations, mapGetters } from 'vuex'

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
          <th style="width: 33.33%; padding-bottom: 10px;">Artikel</th>
          <th style="width: 33.33%; padding-bottom: 10px;">Anzahl</th>
          <th style="width: 33.33%; padding-bottom: 10px;">Preis</th>
        </tr>
      </thead>
      <tr>
        <td colspan="3" style="border-bottom: 1px solid #a3a3a3;"></td>
      <tr>
        <td colspan="3" style="height: 10px;"></td>
      </tr>
      </tr>
      <tbody>
        <tr v-for="article in getArticlesInCart" :key="article.ProduktID">
          <td style="width: 33.33%; text-align: center;">{{ article.Produkttitel }}</td>
          <td style="width: 33.33%; text-align: center;">
            <button class="btn-increase" @click="removeOneFromCart(article.ProduktID)">
              <template v-if="article.amount > 1">-</template>
              <template v-else><i class="fas fa-trash"></i></template>
            </button>
            {{ article.amount }}
            <button class="btn-decrease" @click="addOneToCart(article.ProduktID)">+</button>
          </td>
          <td style="width: 33.33%; text-align: center;">{{ (article.amount * article.PreisBrutto).toFixed(2) }} €</td>
        </tr>
        <tr></tr>
        <td colspan="0" style="width: 33.33%; text-align: center; padding-top: 15px;">
          <strong>Gesamtbetrag:</strong>
        </td>
        <td colspan="1" style="width: 33.33%; text-align: center; padding-top: 15px;"></td>

        <td colspan="2" style="width: 33.33%; text-align: center; padding-top: 15px;">
          <strong>{{ sumOfArticlesInCart.toFixed(2)}} €</strong>
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
  computed: { ...mapGetters(['getArticlesInCart']), 
    sumOfArticlesInCart() {
      return this.$store.getters.getArticlesInCart.reduce((sum, article) => sum + article.amount * article.PreisBrutto, 0);
    }
  },
  methods: {
    ...mapMutations(['addOneToCart', 'removeOneFromCart']),
    payment() {
      fetch('create_checkout_session.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: this.articlesInCart
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            const stripe = Stripe('pk_test_51QU6m7KaPZs8yxC8TyVsHez6Vg2jh0k9S3vKEcXKR1WxmlqWt109UItAYzHV4233UfzfMr5PtT9poQ8ZIBYpN5tx001X6LSdYJ');
            stripe.redirectToCheckout({ sessionId: data.id });
          } else {
            alert('Fehler bei der Bezahlung: ' + data.error);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Fehler bei der Bezahlung.');
        });
    }
  }
}