<template lang="pug">
	div
		v-card(class="pa-5 mb-10")
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

		h3.mb-5 Previous Schedules
		v-data-table(:headers="headers" 
			:items="schedules" 
			:items-per-page="5" 
			item-key='id' 
			class="elevation-1" 
			:single-select="singleSelect" 
			:loading='loading' 
			:loading-text="loadingText"
			:sort-by="['created']"
			:sort-desc="[true]"
		)
			template(v-slot:item.actions="{ item }")
				v-icon(@click="deleteAvail(item.id)") mdi-delete
</template>
<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Vuex from 'vuex';
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store';
import {schedule} from '@/interfaces/GlobalTypes'
import moment from 'moment'

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
	private singleSelect: boolean = false;
	private loading: boolean = false;
	private loadingText: string = 'The sched-o-matic is working hard on your request'
	
	private schedules: schedule[] = [];

	headers = [
		{text: 'Submitted', value: 'created'},
		{text: 'STATUS', value: 'status'},
		{text: 'Monday', value: 'mon'},
		{text: 'Tuesday', value: 'tue'},
		{text: 'Wednesday', value: 'wed'},
		{text: 'Thursday', value: 'thu'},
		{text: 'Friday', value: 'fri'},
		{text: 'Max Hours', value: 'max_hours'},
		{text: 'Delete', value: 'actions'},
		//d-none must have leading space in string to work. Hide from table but id is still attached
		{text: 'Id', value: 'id', align: ' d-none'} 
	];

	parseStatus(status) {
		switch(status) {
			case 0:
				return 'Pending';
			case 1:
				return 'Approved';
			case 2:
				return 'Denied'
			default:
				console.log("Nothing")
		}
	}

	timeFormat(schedule) {
		let formattedSchedule = {
			'created': moment(schedule['created']).format('MM/DD/YYYY'),
			'mon': moment(schedule['mon_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['mon_end_1'], 'HH:mm:ss').format('h:mm A'),
			'tue': moment(schedule['tue_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['tue_end_1'], 'HH:mm:ss').format('h:mm A'),
			'wed': moment(schedule['wed_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['wed_end_1'], 'HH:mm:ss').format('h:mm A'),
			'thu': moment(schedule['thur_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['thur_end_1'], 'HH:mm:ss').format('h:mm A'),
			'fri': moment(schedule['fri_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['fri_end_1'], 'HH:mm:ss').format('h:mm A'),
			'max_hours': schedule['max_hours'],
			'status': this.parseStatus(schedule['status']),
			'id': schedule.id
		}
		for (const [key, value] of Object.entries(formattedSchedule)) {
			if(value === '12:00 AM - 12:00 AM') {
				formattedSchedule[key] = 'OFF'
			}
		}
		this.schedules.push(formattedSchedule)
	}

	created() {
		this.loading = true;
		this.$axios.get('/schedules/user/availability') 
		.then(response => {
			response.data.forEach((schedule: { [x: string]: string; }) => {
				this.timeFormat(schedule)
			});
			this.loading = false;
		})
		.catch(function (error: any) {
			console.log(error);
		})
		.then(function () {
			// always executed
		}); 
	}

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
		.then((response: any) => {
			this.timeFormat(response.data)
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	deleteAvail(id) {
		this.$axios.delete('/schedules/availability/delete/' + id)
		.then((response: any) => {
			var removeIndex = this.schedules.map(item => item.id).indexOf(id);
			~removeIndex && this.schedules.splice(removeIndex, 1);
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	
}
</script>

<style scoped>

</style>