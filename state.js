window.process = { env: {} } /* help vuex.esm cope with living in browser */

import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            articles: [],
            articlesAll: [],
            articlesInCart: [],
        }
    },
    mutations: {
        fetchArticles(state) {
            state.articles = state.articlesAll = [
                { "ProduktID": "1", "Produktcode": "PHP1", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 1 ", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "100.0000", "Mwstsatz": "7.0000", "PreisBrutto": "107.0000", "Lagerbestand": "100", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "https://1techpc.de/wp-content/uploads/2023/06/einfuehrung-in-die-webentwicklung-mit-php-und-mysql-1.png?v=1687182850" },
                { "ProduktID": "3", "Produktcode": "PHP2", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 2", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "" },
                { "ProduktID": "4", "Produktcode": "PHP3", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 3", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "" },
                { "ProduktID": "5", "Produktcode": "JAVA1", "Produkttitel": "Einf\u00fchrung in JAVA ", "Autorname": "Max Mustermann", "Verlagsname": "DPUNKT Verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in JAVA .. ", "Gewicht": "1500", "LinkGrafikdatei": "" }
            ];
        },
        onSearchQueryChange(state, searchQuery) {
            state.articles = state.articlesAll.filter(article =>
                article.Produkttitel.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

    }
})

export default store;