<template lang="pug">
v-card(width="256" clipped-left permanent)
	v-navigation-drawer(app class="elevation-3")
		v-list-item
			v-list-item-content
				v-list-item-title(class="title") Sched - O - Matic 5000
		v-divider
		v-list(dense nav)
			v-list-item(v-for="item in items" :key="item.title" :to="item.path" link)
				v-list-item-icon
					v-icon {{ item.icon }}
				v-list-item-content
					v-list-item-title {{ item.title }}

		template(v-slot:append)
			div(class="pa-5")
				v-btn(color="#F2594B" block class="white--text text-center" medium v-if="" @click='signout()') Sign Out

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import '@mdi/font/css/materialdesignicons.css'
import { SideNavItem } from '@/interfaces/GlobalTypes'

@Component({
    name: 'SideNav',
})
export default class SideNav extends Vue {

	private items: Array<SideNavItem> = [
		{ title: '',icon: '', path: ''},
	]

	created() {
		if(this.$store.getters.getUser.is_superuser) {
			this.items = [
				{ title: 'Calendar', icon: 'mdi-calendar-month', path: '/userHome'},
				{ title: 'Requests', icon: 'mdi-checkbox-multiple-marked', path: '/workerRequests'},
				{ title: 'Schedules', icon: 'mdi-calendar-clock', path: '/admin/schedule'},
				{ title: 'Availabilities', icon: 'mdi-clock-outline', path: '/admin/availability'},
				{ title: 'Users', icon: 'mdi-account-multiple', path: '/users'},
			]
		} else {
			this.items = [
				{ title: 'My Schedule', icon: 'mdi-calendar-clock', path: '/userHome'},
				{ title: 'Leave Requests', icon: 'mdi-checkbox-multiple-marked', path: '/workerRequests'},
				{ title: 'Submit Availability', icon: 'mdi-clock-time-five-outline', path: '/user/availability'},
			]
		}
	}
	
	signout() {
		localStorage.removeItem('token')
		sessionStorage.clear()
		this.$router.push({name: 'Signin'})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>