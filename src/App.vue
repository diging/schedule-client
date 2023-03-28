<template lang="pug">
v-app(d-flex flex-row color="primary")
	v-main(d-flex flex-row)
		SideNav.flex-column.justify-start(v-if="this.$route.path != '/' && this.$route.path != '/createAccount'")
		v-container.flex-column(fill-height)
			router-view
</template>

<script lang="ts">
import router from '@/router';
import Vue from 'vue';
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css'
import SideNav from './components/global/SideNav.vue'
import Signin from './components/auth/Signin.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#F2594B',
        secondary: '#b0bec5',
        anchor: '#8c9eff',
      },
    },
  },
})


export default Vue.extend({
	name: 'App',
	components: {
		SideNav
	},
	data: () => ({
	}),
	
});
</script>

<style>
#app {
	font-family: "Roboto",  sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: #f2f2f2;
}
</style>