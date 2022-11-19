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
			v-icon(@click="setStatus(2)" color="red") mdi-cancel
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
import {formattedSchedule, schedule} from '@/interfaces/GlobalTypes'
import moment from 'moment'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'

const axios = require('axios')

@Component({
	name: 'Availability',
	components: {
		timePicker,
	},
	extends: ScheduleBase
})

export default class Availability extends ScheduleBase {

	private singleSelect: boolean = false;
	private loading: boolean = false;
	private loadingText: string = 'The sched-o-matic is working hard on your request'
	private itemsPerRow: number = 10
	private reason: string = ""
	private status: number = 0
	private id: number = 0
	private dialog: boolean = false
	private schedules: formattedSchedule[] = []

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

	constructor() {
        super();
    }

	setStatus(status: number) {
		this.status = status
	}

	created() {
		this.loading = true;
		this.$axios.get('schedules/availability/list')
		.then(response => {
			response.data.forEach((schedule: schedule) => {
				this.formatScheduleTime(schedule, this.schedules)
			})
			this.loading = false;
		})
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
		})
	}

	postSched() {
		let maxHoursDecimal = Number.parseFloat(this.maxHours).toFixed(2);
		this.$axios.post('/schedules/availability/create', {
			schedule: store.getters.timeValues,
			maxHours: maxHoursDecimal
		})
		.then((response: any) => {
			this.formatScheduleTime(response.data, this.schedules)
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	triggerDialog(id: number, status: number) {
		this.dialog = true
		this.id = id
		this.status = status
	}

	approve() {
		this.dialog = false
		this.$axios.patch('/schedules/availability/approve/' + this.id, {
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