<template lang="pug">
	v-app(d-flex)
		Header(v-if="this.$route.path != '/'")
		v-content
			v-container(fill-height)
				router-view
</template>

<script lang="ts">
import router from '@/router';
import Vue from 'vue';
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css'
import Header from './components/global/Header.vue';
import Signin from './components/auth/Signin.vue';

export default Vue.extend({
	name: 'App',
	components: {
		Header,
		Signin,
		//Footer,
	},
	data: () => ({
	}),
	
});
</script>
<style lang="scss">
#app {
	font-family: "Roboto",  sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: #f2f2f2;
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}


</style>