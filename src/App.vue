<template lang="pug">
	v-app(d-flex)
		headerAdmin(v-if="this.$route.path != '/' && this.$route.path != '/createAccount'")
		v-content
			v-container(fill-height)
				router-view
</template>

<script lang="ts">
import router from '@/router';
import Vue from 'vue';
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css'
import headerUser from './components/global/headerUser.vue';
import headerAdmin from './components/global/headerAdmin.vue';
import Signin from './components/auth/Signin.vue';

export default Vue.extend({
	name: 'App',
	components: {
		headerUser,
		headerAdmin,
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
</style>