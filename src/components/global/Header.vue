<template lang="pug">
	div
		v-toolbar(app clipped-left elevate-on-scroll)
			v-toolbar-title(class="ml-4") DIGING Scheduler
			v-spacer
			v-btn(color="#F2594B" class="white--text" medium v-if="!this.$store.getters.loggedIn" @click="signup") Sign In
			v-btn(text v-if="this.$store.getters.loggedIn" @click="logout") Sign Out	

		v-navigation-drawer(clipped permanent app class="mt-16")
			v-list(dense nav)
				v-list-item(v-for="item in items" :key="item.title" link)
					v-list-item-icon
						v-icon {{ item.icon }}
					v-list-item-content
						v-list-item-title {{ item.title }}

				
</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
export default Vue.extend({
	name: 'Header',
	props: {
		msg: String,
	},
	data() {
		return {
			items: [
				{ title: 'Worker Schedule', icon: 'mdi-clock-time-five-outline'},
				{ title: 'Leave Requests', icon: 'mdi-list-status'},
				{ title: 'Your Schedule', icon: 'mdi-briefcase'},
			]			
		};
  	},
	methods: {
		
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li a {
	color: inherit; /* blue colors for links too */
	text-decoration: inherit; /* no underline */
}
.v-toolbar {
	flex: unset;
}
</style>