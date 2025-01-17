window.process = { env: {} } /* help vuex.esm cope with living in browser */

import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            articlesFiltered: [],
            articlesAll: [],
            _articlesInCartMap: new Map(),
        }
    },
    mutations: {
        fetchArticles(state) {
            state.articlesFiltered = state.articlesAll = [
                { "ProduktID": "1", "Produktcode": "PHP1", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 1 ", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "100.0000", "Mwstsatz": "7.0000", "PreisBrutto": "107.0000", "Lagerbestand": "100", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "https://1techpc.de/wp-content/uploads/2023/06/einfuehrung-in-die-webentwicklung-mit-php-und-mysql-1.png?v=1687182850" },
                { "ProduktID": "3", "Produktcode": "PHP2", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 2", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "" },
                { "ProduktID": "4", "Produktcode": "PHP3", "Produkttitel": "Einf\u00fchrung in PHP 8.0 - Teil 3", "Autorname": "Max Mustermann", "Verlagsname": "Spring verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in PHP 8.0 .. ", "Gewicht": "1500", "LinkGrafikdatei": "" },
                { "ProduktID": "5", "Produktcode": "JAVA1", "Produkttitel": "Einf\u00fchrung in JAVA ", "Autorname": "Max Mustermann", "Verlagsname": "DPUNKT Verlag ", "PreisNetto": "200.0000", "Mwstsatz": "7.0000", "PreisBrutto": "214.0000", "Lagerbestand": "50", "Kurzinhalt": "super Einf\u00fchrung in JAVA .. ", "Gewicht": "1500", "LinkGrafikdatei": "" }
            ];
        },
        onSearchQueryChange(state, searchQuery) {
            state.articlesFiltered = state.articlesAll.filter(article =>
                article.Produkttitel.toLowerCase().includes(searchQuery.toLowerCase())
            );
        },
        addOneToCart(state, productID) {
            // If the product is not in the cart, add it with a quantity of 0
            if (!state._articlesInCartMap.has(productID)) {
                state._articlesInCartMap.set(productID, 0);
            }

            // check if the product is in stock
            if (state._articlesInCartMap.get(productID) < state.articlesAll.find(article => article.ProduktID === productID).Lagerbestand) {
                state._articlesInCartMap.set(productID, state._articlesInCartMap.get(productID) + 1);
            }
        },
        removeOneFromCart(state, productID) {
            // If the product is not in the cart, do nothing
            if (!state._articlesInCartMap.has(productID)) {
                return;
            }

            // If the product is in the cart, remove one from the quantity if it is greater than 0
            if (state._articlesInCartMap.get(productID) > 0) {
                state._articlesInCartMap.set(productID, state._articlesInCartMap.get(productID) - 1);
            }
        },
    },
    getters: {
        getArticlesInCart(state) {
            let articlesInCart = state.articlesAll
                .filter(article => state._articlesInCartMap.has(article.ProduktID) && state._articlesInCartMap.get(article.ProduktID) > 0)
                .map(article => ({
                    ...article,
                    amount: state._articlesInCartMap.get(article.ProduktID)
                }));

            console.log(articlesInCart.reduce((sum, article) => sum + article.amount * article.PreisBrutto, 0));

            return articlesInCart;
        }
    }
});

export default store;