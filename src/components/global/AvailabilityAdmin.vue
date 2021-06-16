<template lang="pug">
	div
		h3.mb-5 Availabilites
		v-data-table(:headers="headers" 
			:items="schedules" 
			:items-per-page="itemsPerRow" 
			item-key='id' 
			class="elevation-1" 
			:single-select="singleSelect" 
			:loading='loading' 
			:loading-text="loadingText"
			:sort-by="['created']"
			:sort-desc="[true]"
		)
			template(v-slot:item.actions="{ item }")
				v-icon(@click="triggerDialog(item.id, 1)" color="green") mdi-check
				v-icon(@click="setStatus('Deny')" color="red") mdi-cancel
		v-dialog(v-model="dialog" width="500")
			v-card
				v-card-title(class="text-h5 grey lighten-2") Reason
				v-card-text
					v-textarea.mt-5(v-model="reason" outlined)
				v-divider
				v-card-actions
					v-spacer
					v-btn(color="primary" text @click="approve()") Submit
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
	name: 'AvailabilityAdmin',
	components: {
		timePicker,
	},

})

export default class AvailabilityAdmin extends Vue{
	private isHidden: boolean=false;
	private dialog: boolean=false;
	private days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
	private startTime1: string = 'startTime1'
	private endTime1: string = 'endTime1'
	private startTime2: string = 'startTime2'
	private endTime2: string = 'endTime2'
	private maxHours: string = '0.0'
	private singleSelect: boolean = false;
	private loading: boolean = false;
	private loadingText: string = 'The sched-o-matic is working hard on your request'
	private itemsPerRow: number = 10
	private reason: string = ""
	private status: number = 0
	private id: number = 0

	
	private schedules: schedule[] = [];

	headers = [
		{text: 'Submitted', value: 'created'},
		{text: 'STATUS', value: 'status'},
		{text: 'Name', value: 'name'},
		{text: 'Monday', value: 'mon'},
		{text: 'Tuesday', value: 'tue'},
		{text: 'Wednesday', value: 'wed'},
		{text: 'Thursday', value: 'thu'},
		{text: 'Friday', value: 'fri'},
		{text: 'Max Hours', value: 'max_hours'},
		{text: 'Approve/Deny', value: 'actions'},
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

	setStatus(status) {
		this.status = status
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
			'id': schedule['id'],
			'name' : schedule['user']['full_name']
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
		this.$axios.get('schedules/availability/list') 
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
		})
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
	triggerDialog(id, status) {
		this.dialog = true
		this.id = id
		this.status = status
	}
	approve() {
		this.dialog = false
		this.$axios.patch('/schedules/availability/update/' + this.id, {
			'status': this.status,
			'reason': this.reason
		})
		.then((response: any) => {
			var removeIndex = this.schedules.map(item => item.id).indexOf(this.id);
			this.schedules[removeIndex]['status'] = this.parseStatus(this.status)
			this.status = 0
			this.reason = ''
			this.id = 0
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}
}
</script>

<style scoped>

</style>