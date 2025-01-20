import { mapState, mapMutations } from 'vuex';

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
      article.Lagerbestand = parseInt(article.Lagerbestand) + 1;
    },
    decrement(article) {
      let neuerWert = parseInt(article.Lagerbestand) - 1;
      if (neuerWert < 0) neuerWert = 0;
      article.Lagerbestand = neuerWert;
    },
    confirmUpdate() {
      console.log('Aktualisierte Artikeldaten:', this.articlesAll);
      // Implementieren Sie hier den API-Aufruf, um die Bestände zu bestätigen.
    },
    async validateAdmin() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to access this page.');
          window.location.href = '/login';
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
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error validating admin:', error);
        alert('An error occurred while validating your permissions.');
        window.location.href = '/';
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