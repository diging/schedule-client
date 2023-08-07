<template lang="pug">
div
	v-card(class="pa-5 mb-10")
		h4(class="text-center") Edit your schedule.
		v-alert(v-if="updateAlert" type="success") Availability updated successfully.
		v-container
			p(class="body-2 mb-10") Lab hours are from 8:00 AM to 5:00 PM.
			div(v-for="day in days" :key="day")
				div(v-if="availabilityTimes[day].length===0")
					v-row
						v-col(cols='3')
							p(class="font-weight-medium body-2") {{day}}
						v-col(cols='4')
							timePicker(:day='day' :index='startTime1' :maxTime='endTime1')
						v-col(cols='4')
							timePicker(:day='day' :index='endTime1' :minTime='startTime1')
						v-col(cols='1')
							v-btn(icon color="#F2594B" @click="updateAvailability(day, selectedItemID)")
								v-icon mdi-plus-circle-outline
				div(v-else)
					div(v-for="(avItem, avIndex) in availabilityTimes[day]" :key="day + avIndex.toString()")
						v-row
							v-col(cols='3')
								p(class="font-weight-medium body-2") {{day}}
							v-col(cols='4')
								timePicker(:day='day' :index='startTime1')
							v-col(cols='4')
								timePicker(:day='day' :index='endTime1')
							v-col(cols='1')
								v-btn(icon color="#F2594B" @click="updateAvailability(day)")
									v-icon mdi-plus-circle-outline
				v-row(class="mt-n6 mb-4" v-if="isHidden")
					v-col(cols='3')
					v-col(cols='4')
						timePicker(:day='day' :index='startTime2')
					v-col(cols='4')
						timePicker(:day='day' :index='endTime2')
					v-col(cols='1')
			v-row
				v-col.pt-4(cols='3')
				p.pt-3(class="font-weight-medium body-2") Max Hours
				v-col(cols='3')
				v-text-field(v-model="maxHours" outlined dense)
		v-card-actions
			v-spacer
			v-btn(color="grey" text @click="dialog = false") Cancel
			v-btn(color="#F2594B" medium class="white--text" @click="postSched()") Submit

	h3.mb-5 Submitted Availabilities
	v-data-table(:headers="headers"
		:items="availabilities"
		:items-per-page="5"
		item-key="id"
		class="elevation-1"
		:single-select="singleSelect"
		:loading="loading"
		:loading-text="loadingText"
		:sort-by="['created']"
		:sort-desc="[true]"
	)
		template(v-slot:body="{ items }")
			tbody
				tr(:class="item.id === selectedItemID ? 'custom-highlight-row' : ''" v-for="item in items" :key="item.id" :active="selectedItemID == item.id" @click="selectedItem = item.id")
						td {{ item.created }}
						td {{ item.status }}
						td {{ item.mon }}
						td {{ item.tue }}
						td {{ item.wed }}
						td {{ item.thu }}
						td {{ item.fri }}
						td {{ item.max_hours }}
						td
							v-icon(v-if="item.status == 'Pending'" @click="deleteAvail(item.id)") mdi-delete
					

</template>
<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Vuex from 'vuex'
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store'
import {formattedAvailability, availability} from '@/interfaces/GlobalTypes'
import { ScheduleBase }  from '@/components/Bases/ScheduleBase'

const axios = require('axios')

@Component({
	name: 'Availability',
	components: {
		timePicker,
	},
	extends: ScheduleBase
})

export default class Availability extends ScheduleBase {

	private singleSelect: boolean = false
	private updateAlert: boolean = false
	private loading: boolean = false
	private loadingText: string = 'The sched-o-matic is working hard on your request'
	private dialog: boolean = false
	private startTime1: string = "startTime1"
	private endTime1: string = "endTime1"
	private startTime2: string = "startTime2"
	private endTime2: string = "endTime2"
	private isHidden: boolean = false
	private availabilityTimes: { [x: string]: any[]; } = {}
	private days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
	private time_suffixes = ['_start_1', '_start_2', '_end_1', '_end_2']
	private day_time_strings: string[] = []
	private availabilities: formattedAvailability[] = []
	private maxHours: number = 0

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
	]

	updateAvailability(day: string, id: number) {
		this.day_time_strings = []
		var day_abbrev = day.slice(0, 3).toLowerCase()
		for (var time of this.time_suffixes) {
			this.day_time_strings.push(day_abbrev + time)
		}
		this.$axios.patch('/schedules/availability/update/' + id, {
			'time_strings': this.day_time_strings,
			'sched_times': store.getters.getDaySched(day)
		})
		.then((response: any) => {
			this.updateAlert = true
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}

	created() {
		for (var day of this.days) {
			this.availabilityTimes[day] = []
		}
		this.loading = true
		this.$axios.get('/schedules/user/availability')
		.then(response => {
			response.data.forEach((avail: availability) => {
				this.formatAvailabilityTime(avail, this.availabilities)
			})
			this.loading = false
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}

	postSched() {
		this.$axios.post('/schedules/availability/create', {
			schedule: store.getters.timeValues,
			maxHours: this.maxHours
		})
		.then((response: any) => {
			this.formatAvailabilityTime(response.data, this.availabilities)
			store.commit('resetState')
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}

	deleteAvail(id: number) {
		this.$axios.delete('/schedules/availability/delete/' + id)
		.then((response: any) => {
			var removeIndex = this.availabilities.map(item => item.id).indexOf(id)
			~removeIndex && this.availabilities.splice(removeIndex, 1)
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}
}

</script>

<style scoped>
	.custom-highlight-row {
		background-color: pink
	}
</style>