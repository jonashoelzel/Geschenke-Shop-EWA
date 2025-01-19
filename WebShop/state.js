window.process = { env: {} } /* help vuex.esm cope with living in browser */

import { createStore } from 'vuex';
import fetchProdukt from './apis/get_produkt.js';

const store = createStore({
    state() {
        return {
            articlesFiltered: [],
            articlesAll: [],
            _articlesInCartMap: new Map(),
            MwStSatz: 0.07,
        }
    },
    mutations: {
        fetchArticles(state) {
            fetchProdukt().then(data => {
                if (data != null) {
                    state.articlesFiltered = state.articlesAll = data;
                }
                else {
                    console.log("Error fetching articles. Loading default articles.");

                    state.articlesFiltered = state.articlesAll = [
                        { "prodID": "00000", "titel": "Smiley Lampe", "beschreibung": "Süß, aber irgendwie auch bissl creepy – leuchtet dein Zimmer aus und schaut dir dabei direkt in die ", "hersteller": "FunFlow", "bild": "https://i.ebayimg.com/images/g/gFgAAOSwCPZlZF~v/s-l1600.webp", "menge": "150", "preis": "19.99" },
                        { "prodID": "00001", "titel": "Hausschuhe", "beschreibung": "Hausschuhe wie haarige Hobbit-Füße – flauschig, witzig und der ultimative Style für daheim!", "hersteller": "dm", "bild": "https://i.ebayimg.com/images/g/qj0AAOSwySNgJXzK/s-l1200.jpg", "menge": "70", "preis": "15.99" }
                    ];
                }
            });
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
            if (state._articlesInCartMap.get(productID) < state.articlesAll.find(article => article.prodID === productID).bestand) {
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
                .filter(article => state._articlesInCartMap.has(article.prodID) && state._articlesInCartMap.get(article.prodID) > 0)
                .map(article => ({
                    ...article,
                    amount: state._articlesInCartMap.get(article.prodID)
                }));

            return articlesInCart;
        }
    }
});

export default store;