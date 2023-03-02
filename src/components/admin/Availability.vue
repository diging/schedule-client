<template lang="pug">
div
	h3.mb-5 Availabilites
	v-data-table(
		v-model="selected"
		show-select
		:headers="avail_headers"
		:items="availabilities"
		:items-per-page="itemsPerRow"
		item-key='id'
		class="elevation-1"
		:loading='loading'
		:loading-text="loadingText"
		:sort-by="['created']"
		:sort-desc="[true]"
		:single-expand="singleExpand"
    	:expanded.sync="expanded"
		show-expand
	)
		template(v-slot:expanded-item="{ headers, item }")
			td(:colspan="headers.length")
				v-container
					div(v-for="(day, index) in days" :key="day.title")
						v-row
							v-col(cols='3')
								p(class="font-weight-medium body-2") {{ day.title }}
							v-col(cols='4')
								timePicker(:day='day.title' :index='startTime1')
							v-col(cols='4')
								timePicker(:day='day.title' :index='endTime1')
							v-col(cols='1')
								v-btn(icon color="#F2594B" @click="updateAvailability(day.title, item.id)")
									v-icon mdi-plus-circle-outline
		template(v-slot:item.actions="{ item }")
			v-icon(@click="triggerDialog(item.id, 1)" color="green") mdi-check
			v-icon(@click="setStatus(2)" color="red") mdi-cancel
			v-menu(offset-y)
	v-dialog(v-model="dialog" width="500")
		v-card
			v-card-title(class="text-h5 grey lighten-2") Reason
			v-card-text
				v-textarea.mt-5(v-model="reason" outlined)
			v-divider
			v-card-actions
				v-spacer
				v-btn(color="primary" text @click="approve()") Submit
	template
			v-card(flat)
					v-container(class="px-0" fluid)
						v-radio-group(color="primary" v-model='meetingDay')
							v-radio(v-for="day in days" :key="day.title" :label="day.title" :value="day.title")
							div(v-if="meetingDay")
								v-col
									timePicker(:day='meetingDay' :index='startTime1')
									timePicker(:day='meetingDay' :index='endTime1')
								v-col
									v-container(fluid)
										v-overflow-btn(
											editable 
											label="Please select the meeting type"
											:items="meeting_types"
											item-value="text"
											v-model="meeting_type"
										)
						v-btn(color="primary" @click="setMeeting()" :disabled="disableBtn()") Submit
	template
		v-row
			v-col(class="pa-12")
				v-range-slider(:tick-labels="tick_labels"
					v-model="range"
					:value="[0,1]"
					:min="min"
					:max="max"
					ticks="always"
					tick-size="4"
				)
					template(v-slot:prepend)
						v-text-field(:value="window_times[range[0]]"
							class="mt-0 pt-0"
							hide-details
							single-line
							type="string"
							style="width: 60px"
							@change="$set(range, 0, $event)"
						)
					template(v-slot:append)
						v-text-field(:value="window_times[range[1]]"
							class="mt-0 pt-0"
							hide-details
							single-line
							type="string"
							style="width: 60px"
							@change="$set(range, 1, $event)"
						)
				div(class="text-left")
					v-btn(color="primary" v-model="best_meeting_times" @click="getBestMeetingTime(window_times[range[0]], window_times[range[1]])") Get Team Meeting Times
		div
			h2(class="text-center") {{ days[index].title }}
			v-simple-table(light)
				template
					thead
						tr(class="text-center")
						tr
							td(v-for="time in window_times" :key="time")
								v-chip(:color="getColor(time)" dark large) {{ time }}
		div(class="text-center")
			v-pagination(
				v-model="page"
				:length="days.length"
				@next="next"
				@previous="prev"
			)

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Vuex from 'vuex'
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store'
import {formattedAvailability, availability} from '@/interfaces/GlobalTypes'
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

	private selected: { [key: string]: string[]}[] = [] 
	private singleExpand: boolean = false
	private expanded: [] = []
	private startTime1: string = "startTime1"
	private endTime1: string = "endTime1"
	private startTime2: string = "startTime2"
	private endTime2: string = "endTime2"
	private loading: boolean = false
	private loadingText: string = 'Loading...'
	private itemsPerRow: number = 10
	private reason: string = ""
	private status: number = 0
	private id: number = 0
	private name: string = ""
	private dialog: boolean = false
	private availabilities: formattedAvailability[] = []
	private alertMessage: string = ''
	private invalidLogin: boolean = false
	private selectedItem: number = 1
	private day: string = ""
	private days: {}[] = [{title: 'Monday'}, {title: 'Tuesday'}, {title: 'Wednesday'}, {title: 'Thursday'}, {title: 'Friday'}]
	private pickedDay: boolean = false
	private picker = null
	private day_time_strings: string[] = []
	private time_suffixes = ['_start_1', '_start_2', '_end_1', '_end_2']
	private time: string = ""
	private window_times: string[] = [
		"9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30",
		"10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15",
		"12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00"
	]
	private tick_labels: string[] = [
		"9:00", "", "", "", "10:00", "", "",
		"", "11:00", "", "", "", "12:00", "",
		"", "", "13:00", "", "", "", "14:00"
	]
	private range: number[] = [0, 20]
	private min: number = 0
	private max: number = 20
	private time_binary_list: number[][] = new Array(10)
	private page: number = 1
	private index: number = 0
	private meetingDay: string = ""
	private attendees: string[] = ['Bob', 'Doug', 'Susie']
	private meeting_types: { [key: string]: any }[] = [{text: 'Bi-weekly'}, {text: 'Standup'}, {text: 'Orientation'}]
	private meeting_type: string = ""
	private disabled: boolean = true
	private best_times: string[][] = [
		["9:00", "9:15", "9:30", "9:45", "10:00"], ["10:15", "10:30",
		"10:45"], ["11:00", "11:15", "11:30", "11:45"], ["12:00", "12:15",
		"12:30", "12:45"], ["13:00", "13:15", "13:30", "13:45", "14:00"]
	]
	private best_meeting_times: string[][] = [
		["12:00"], ["12:00"], ["12:00"], ["12:00"], ["12:00"],
		["12:00"], ["12:00"], ["12:00"], ["12:00"], ["12:00"]
	]
	avail_headers = [
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
	]

	constructor() {
        super()
    }

	next() {
		this.index = this.index + 1
	}

	prev() {
		this.index = this.index - 1
	}

	setStatus(status: number) {
		this.status = status
	}

	getColor(time_slot: string) {
		if(this.best_meeting_times[this.index].includes(time_slot)) {
			return 'blue'
		} else {
			return 'orange'
		}
	}

	created() {
		this.loading = true
		this.$axios.get('schedules/availability/list')
		.then(response => {
			response.data.forEach((avail: availability) => {
				this.formatAvailabilityTime(avail, this.availabilities)
			})
			this.loading = false
		})
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
		})
	}

	postSched() {
		let maxHoursDecimal = Number.parseFloat(this.maxHours).toFixed(2)
		this.$axios.post('/schedules/availability/create', {
			schedule: store.getters.timeValues,
			maxHours: maxHoursDecimal
		})
		.then((response: any) => {
			this.formatAvailabilityTime(response.data, this.availabilities)
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
			var removeIndex = this.availabilities.map(item => item.id).indexOf(this.id)
			this.availabilities[removeIndex]['status'] = this.parseStatus(this.status)
			this.status = 0
			this.reason = ''
			this.id = 0
		})
		.catch((error) => {
			console.log(error)
		})
	}

	disableBtn() {
		return this.selected.length == 0 || !this.meetingDay || !this.meeting_type
	}

	setMeeting() {
		let attendees = []
		for(let avail of this.selected) {
			attendees.push(avail.name)
		}
		let day = 0
		switch (this.meetingDay) {
			case 'Monday':
				day = 1
				break
			case 'Tuesday':
				day = 2
				break
			case 'Wednesday':
				day = 3
				break
			case 'Thursday':
				day = 4
				break
			case 'Friday':
				day = 5
				break
		}
		this.$axios.post('/schedules/meeting/create/', {
			'start': store.getters.getDaySched(this.meetingDay)['startTime1'],
			'end': store.getters.getDaySched(this.meetingDay)['endTime1'],
			'day': day,
			'meeting_type': this.meeting_type,
			'attendees': attendees
		})
	}

	updateAvailability(day: string, id: number) {
		this.day_time_strings = []
		var day_abbrev = day.slice(0, 3).toLowerCase()
		for (var time of this.time_suffixes) {
			this.day_time_strings.push(day_abbrev + time)
		}
		this.$axios.patch('/schedules/availability/update/' + id, {
  			time_strings: this.day_time_strings,
			sched_times: store.getters.getDaySched(day)
		})
		.then((response: any) => {
			var updated_time = this.formatDayTime(response.data.day)
			var selected_avail = this.availabilities.find((obj) => {
				return obj.id === this.selectedItem
			})
			if (selected_avail !== undefined) {
				selected_avail[day_abbrev] = updated_time
			}
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}

	getBestMeetingTime(range_start: string, range_end: string) {
		this.time_binary_list = []
		var meeting_times: string[][] = []
		var range_start_str = range_start.split(':')
		var range_start_units = Number((Number(range_start_str[0]) * 4) + (Number(range_start_str[1]) / 15))
		var range_end_str = range_end.split(':')
		var range_end_units = Number((Number(range_end_str[0]) * 4) + (Number(range_end_str[1]) / 15))
		this.$axios.get('schedules/availability/list')
		.then(response => {
			response.data.forEach((availability: any) => {
				var start_avail_units = 0
				var end_avail_units = 0
				for (var key in availability) {
					if (key.includes("start")) {
						var time_str = availability[key]?.split(':')
						start_avail_units = Number((Number(time_str[0]) * 4) + (Number(time_str[1]) / 15))
					}
					if (key.includes("end")) {
						time_str = availability[key]?.split(':')
						end_avail_units = Number((Number(time_str[0]) * 4) + (Number(time_str[1]) / 15))
						this.time_binary_list.push(this.createTimeIncrementBinaries(start_avail_units, end_avail_units, range_start_units, range_end_units))
					}
				}
				for (var i=0; i<this.time_binary_list.length; i++) {
					var time_list: string[] = []
					for (var j=0; j<this.time_binary_list[i].length; j++) {
						if (this.time_binary_list[i][j] == 1 && this.time_binary_list[i][j+1] == 1 && this.time_binary_list[i][j+2] == 1 && this.time_binary_list[i][j+3] == 1) {
							var hours = Math.floor((range_start_units + j) / 4)
							var minutes = (((range_start_units + j) % 4) * 15).toLocaleString('en-US', {minimumIntegerDigits: 2})
							var time = hours + ':' + minutes
							time_list.push(time)
						}
					}
					meeting_times.push(time_list)
				}
				this.time_binary_list.splice(0)
			})
			var monday_times1: string[][] = []
			var monday_times2: string[][] = []
			var tuesday_times1: string[][] = []
			var tuesday_times2: string[][] = []
			var wednesday_times1: string[][] = []
			var wednesday_times2: string[][] = []
			var thursday_times1: string[][] = []
			var thursday_times2: string[][] = []
			var friday_times1: string[][] = []
			var friday_times2: string[][] = []
			for (var i=0; i<meeting_times.length; i++) {
				switch(i % 10) {
					case 0:
						monday_times1.push(meeting_times[i])
						break
					case 1:
						monday_times2.push(meeting_times[i])
						break
					case 2:
						tuesday_times1.push(meeting_times[i])
						break
					case 3:
						tuesday_times2.push(meeting_times[i])
						break
					case 4:
						wednesday_times1.push(meeting_times[i])
						break
					case 5:
						wednesday_times2.push(meeting_times[i])
						break
					case 6:
						thursday_times1.push(meeting_times[i])
						break
					case 7:
						thursday_times2.push(meeting_times[i])
						break
					case 8:
						friday_times1.push(meeting_times[i])
						break
					case 9:
						friday_times2.push(meeting_times[i])
						break
				}
			}
			var day_lists = []
			day_lists.push(monday_times1)
			//day_lists.push(monday_times2)
			day_lists.push(tuesday_times1)
			//day_lists.push(tuesday_times2)
			day_lists.push(wednesday_times1)
			//day_lists.push(wednesday_times2)
			day_lists.push(thursday_times1)
			//day_lists.push(thursday_times2)
			day_lists.push(friday_times1)
			//day_lists.push(friday_times2)

			var best_meeting_times = []
			for (var list of day_lists) {
				best_meeting_times.push(list.shift()!.filter(function(v) {
					return list.every(function(a) {
						return a.indexOf(v) !== -1
					})
				}))
			}
			this.best_meeting_times = best_meeting_times
						
			return this.best_meeting_times
		})
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
		})
	}

	createTimeIncrementBinaries(start_avail: number, end_avail: number, start_range: number, end_range: number) {
		var day_binaries = new Array(96).fill(0)
		for (var i=start_avail; i<end_avail; i++) {
			day_binaries[i] = 1
		}
		var time_binaries: number[] = day_binaries.slice(start_range, end_range)
		return time_binaries
	}
}

</script>

<style scoped>

</style>