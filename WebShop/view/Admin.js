import { mapState, mapMutations } from 'vuex';
import putBestand from '../apis/put_bestand.js';
import createAndAddProductsToBestellung from '../apis/create_bestellung_and_add_products.js';

export default {
  name: 'Admin',
  template: String.raw`
    <div>
      <h1>Artikel Übersicht</h1>
      <div v-for="article in articlesAll" :key="article.prodID" style="margin-bottom: 1em;">
        <div>
          <strong>{{ article.titel }}</strong><br>
          Lagerbestand: {{ article.bestand }}
        </div>
        <div>
          <button @click="decrement(article)">-</button>
          <button @click="increment(article)">+</button>
        </div>
      </div>
      <button @click="confirmUpdate">Bestände bestätigen</button>
      <button @click="createTestBestellung">Test Bestellung erstellen</button>
    </div>
  `,
  computed: {
    ...mapState(['articlesAll', 'user']),
  },
  methods: {
    ...mapMutations(['fetchArticles']),
    increment(article) {
      article.bestand = parseInt(article.bestand) + 1;
    },
    decrement(article) {
      let neuerWert = parseInt(article.bestand) - 1;
      if (neuerWert < 0) neuerWert = 0;
      article.bestand = neuerWert;
    },
    async confirmUpdate() {
      console.log('Aktualisierte Artikeldaten:', this.articlesAll);
      for (const article of this.articlesAll) {
        try {
          await putBestand(article.prodID, article.bestand);
        } catch (error) {
          console.error(`Fehler beim Aktualisieren des Bestands für Artikel ${article.prodID}:`, error);
        }
      }
    },
    async createTestBestellung() {
      const kundenID = 6; // Replace with actual customer ID
      const preis = 100.00; // Replace with actual price
      const produkte = [
        { prodID: 1, menge: 2 },
        { prodID: 2, menge: 1 }
      ];

      try {
        const result = await createAndAddProductsToBestellung(kundenID, preis, produkte);
        if (result.success) {
          console.log('Bestellung erfolgreich erstellt und Produkte hinzugefügt:', result.bestellungID);
        } else {
          console.error('Fehler beim Erstellen der Bestellung und Hinzufügen der Produkte:', result.message);
        }
      } catch (error) {
        console.error('Fehler beim Erstellen der Bestellung und Hinzufügen der Produkte:', error);
      }
    },
    async validateAdmin() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to access this page.');
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`${this.apiUrl}validate_admin.php?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log('Admin validation response:', data);
        if (!data.isAdmin) {
          alert('You do not have permission to access this page.');
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Error validating admin:', error);
        alert('An error occurred while validating your permissions.');
        this.$router.push('/');
      }
    }
  },
  created() {
    this.fetchArticles();
    this.validateAdmin();
  },
  data() {
    return {
      apiUrl: './login_php/', // Replace with your actual backend API URL
    };
  }
};