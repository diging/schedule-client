<template lang="pug">
	v-card(width="256" clipped-left permanent)
		v-navigation-drawer(app class="elevation-3")
			v-list-item
				v-list-item-content
					v-list-item-title(class="title") DIGING Scheduler
			
			v-divider

			v-list(dense nav)
				v-list-item(v-for="item in items" :key="item.title" link)
					v-list-item-icon
						v-icon {{ item.icon }}
					v-list-item-content
						v-list-item-title {{ item.title }}


			v-btn(color="#F2594B" class="white--text" medium v-if="" to="Signin") Sign In
			v-btn(text v-if="" @click="") Sign Out
		
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

</style>