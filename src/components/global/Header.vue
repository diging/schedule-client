<template lang="pug">
	v-app-bar(app fixed elevate-on-scroll)
		v-toolbar-title(class="ml-4") Sham
		v-menu(class="ml-3" offset-y open-on-hover)
			template(v-slot:activator="{ on }")
				v-btn(text v-on="on") Annotate
					v-icon mdi-menu-down
			v-list
				v-list-item(v-for="item in annotate_items" :key="item.title" v-bind:to="item.link")
					v-list-item-title(v-text="item.title")
		v-btn(text large to="/transactions" class="subheading font-weight-medium") Transactions
		v-btn(text large to="/about" class="subheading font-weight-medium") About
		v-menu(offset-y open-on-hover)
			template(v-slot:activator="{ on }")
				v-btn(text v-on="on") Data
					v-icon mdi-menu-down
			v-list
				v-list-item(v-for="item in data_items" :key="item.title" @click="")
					v-list-item-title(v-text="item.title")
		v-spacer
		v-toolbar-items.hidden-sm-and-down
			v-btn(text v-if="!this.$store.getters.loggedIn" @click="login") Login
			v-btn(text v-if="!this.$store.getters.loggedIn" @click="signup") Sign Up
			v-btn(text v-if="this.$store.getters.loggedIn" @click="logout") Log Out
			v-btn(text) Link Two
			v-btn(text) Link 3
			
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	name: 'Header',
	props: {
		msg: String,
	},
	data() {
		return {
			activeIndex: '1',
			annotate_items: [{ title: 'Text', link: '/text' }, { title: 'Projects', link: '/project' }],
			data_items: [{ title: 'Concepts' }, { title: 'Annotations' }],
			info_items: [
				{ title: 'Overview' },
				{ title: 'Use Cases' },
				{ title: 'Our Team' },
			],
		};
  },
	methods: {
		handleSelect(key: string, keyPath: string[]) {
			this.activeIndex = key;
		},
		pushHome() {
			this.$router.push('/');
		},
		login() {
			this.$router.push('login');
		},
		signup() {
			this.$router.push('signup');
		},
		logout() {
			localStorage.removeItem('token');
			this.login();
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
li a {
	color: inherit; /* blue colors for links too */
	text-decoration: inherit; /* no underline */
}
.v-toolbar {
	flex: unset;
}
</style>