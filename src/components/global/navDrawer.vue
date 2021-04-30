<template lang="pug">
	v-card(width="256" clipped-left permanent)
		v-navigation-drawer(app class="elevation-3")
			v-list-item
				v-list-item-content
					v-list-item-title(class="title") Sched - O - Matic 5000
			
			v-divider

			v-list(dense nav)
				v-list-item(v-for="item in navDrawer" :key="item.title" :to="item.path" link)
					v-list-item-icon
						v-icon {{ item.icon }}
					v-list-item-content
						v-list-item-title {{ item.title }}

			template(v-slot:append)
				div(class="pa-5")
					v-btn(color="#F2594B" block class="white--text text-center" medium v-if="" to="/") Sign Out
		
</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';

@Component({
	name: 'navDrawer',
})

export default class navDrawer extends Vue{
	private navDrawer: any = [];
	private users: any = [];

	created() {
		this.$axios.get('accounts/users/get_current_user',{
			params: {

			}
		})
		.then(response => {
			this.users=response.data;
			console.log(this.users);

			if(this.users['is_staff']==true) {
				this.navDrawer = [
					{ title: 'Worker Schedule', icon: 'mdi-calendar-clock', path: '/adminHome'},
					{ title: 'Leave Requests', icon: 'mdi-checkbox-multiple-marked', path: '/adminLeaveRequests'},
					{ title: 'Employees', icon: 'mdi-account-group', path: '/employees'},
				];
			}
			else if(this.users['is_staff']==false) {
				this.navDrawer = [
					{ title: 'Worker Schedule', icon: 'mdi-calendar-clock', path: '/userHome'},
					{ title: 'Leave Requests', icon: 'mdi-checkbox-multiple-marked', path: '/userLeaveRequests'},
					{ title: 'Availability', icon: 'mdi-clock-time-five-outline', path: '/user/availability'},
				];
			}
			})
		.catch(function (error: any) {
			console.log(error);
		})
		.then(function () {
			// always executed
		}); 
		
	}
				
	
}
</script>

<style scoped>

</style>