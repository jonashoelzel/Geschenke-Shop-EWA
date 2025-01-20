import { createApp } from 'vue';
import router from "./router.js";
import state from "./state.js";

const app = createApp({
    template: `<router-view />`
});

app.use(state);
app.use(router);
app.mount("#app");
