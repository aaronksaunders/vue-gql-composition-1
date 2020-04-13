import Vue from "vue";
import App from "./App.vue";

// GRAPHQL STUFF
import VueCompositionApi, { provide } from "@vue/composition-api";
import { DefaultApolloClient } from "@vue/apollo-composable";
import ApolloClient from "apollo-boost";

// client apollo client
const apolloClient = new ApolloClient({
  connectToDevTools: true,
  uri: "http://localhost:3000"
});

// Need this since we are in NOT in vue3 yet..
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  // add the client to vue object
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: h => h(App)
}).$mount("#app");
