<template lang="pug">
	v-card.float-right.pa-5()
		h4(class="text-center") Edit your schedule.
		v-container
			p(class="body-2 mb-10") Lab hours are from 9:00 AM to 4:30 PM.
			div(v-for="day in days" :key="day")
				v-row
					v-col(cols='3')
						p(class="font-weight-medium body-2") {{day}}
					v-col(cols='4')
						timePicker(:index = 'startTime1' :day='day')
					v-col(cols='4') 
						timePicker(:index = 'endTime1' :day='day')
					v-col(cols='1')
						v-btn(icon color="#F2594B"  v-on:click="isHidden=true") 
							v-icon mdi-plus-circle-outline
				v-row(class="mt-n6 mb-4" v-if="isHidden")
					v-col(cols='3')
					v-col(cols='4')
						timePicker(:index = 'startTime2' :day='day')
					v-col(cols='4') 
						timePicker(:index = 'endTime2' :day='day')
					v-col(cols='1')
			v-row
				v-col.pt-4(cols='3')
					p.pt-3(class="font-weight-medium body-2") Max Hours
				v-col(cols='3')
					v-text-field(v-model="maxHours" @input='formatMaxHours()' outlined dense)
		v-card-actions
			v-spacer
			v-btn(color="grey" text @click="dialog = false") Cancel
			v-btn(color="#F2594B" medium class="white--text" @click="postSched()") Submit

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Vuex from 'vuex';
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store';

const axios = require('axios')

@Component({
	name: 'editSchedule',
	components: {
		timePicker,
	},
})

export default class editSchedule extends Vue{
	private isHidden: boolean=false;
	private dialog: boolean=false;

	days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
	private startTime1: string = 'startTime1'
	private endTime1: string = 'endTime1'
	private startTime2: string = 'startTime2'
	private endTime2: string = 'endTime2'
	private maxHours: string = '0.0'

	formatMaxHours() {
		if(!this.maxHours.includes('.')) {
			if(this.maxHours.length > 2) {
				let last = this.maxHours.slice(-2)
				let rest = this.maxHours.slice(0, -2)
				this.maxHours = rest + "." + last
			} else {
				this.maxHours = '.' + this.maxHours
			}
		} else {
			let split = this.maxHours.split('.').join("");
			if(split.length > 2) {
				let last = split.slice(-2)
				let rest = split.slice(0, -2)
				this.maxHours = rest + "." + last
			} else {
				this.maxHours = '.' + split
			}
		}
	}

	postSched() {
		let maxHoursDecimal = Number.parseFloat(this.maxHours).toFixed(2);
		this.$axios.post('/schedules/availability/create', {
			schedule: store.getters.timeValues,
			maxHours: maxHoursDecimal
		})
		.then(function (response: any) {
			console.log(response);
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	getSched() {
		axios.get('/user', {
			params: {
			ID: 12345
			}
		})
		.then(function (response: any) {
			console.log(response);
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