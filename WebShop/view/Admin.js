import { mapState, mapMutations } from 'vuex';
import putBestand from '../apis/put_bestand.js';

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