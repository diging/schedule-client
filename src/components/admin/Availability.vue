<template lang="pug">
v-card(:width="responsiveWidth")
	v-alert(
		v-if="message"
		:type="msgType"
		v-model= "message"
		:value = "!!message"
	) {{ message }}
	h3.mb-5 Availabilites
	v-data-table(
		v-model="selected"
		show-select
		:headers="avail_headers"
		:items="availabilities"
		:items-per-page="itemsPerRow"
		item-key="id"
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
			v-icon(@click="triggerDialog(item.id)" color="green") mdi-check
			v-icon(@click="denyTimeoff(item.id)" color="red") mdi-cancel
			v-menu(offset-y)
	v-dialog(v-model="dialog" width="500")
		v-card
			v-card-title(class="text-h5 grey lighten-2") Reason
			v-card-text
				v-textarea.mt-5(v-model="reason" outlined)
			v-divider
			v-card-actions
				v-spacer
				v-btn(color="primary" class="secondary--text" text @click="approve()") Submit
	template
		v-card(flat)
			v-container(fluid)
				v-overflow-btn(
					label="Please select the meeting type"
					:items="meetingTypes"
					item-value="text"
					v-model="meetingType"
				)
			v-radio-group(v-if="meetingType == 'Bi-weekly'" color="primary" v-model="meetingDay")
				v-radio(
					v-show="meetingType == 'Bi-weekly'"
					v-for="day in days"
					:key="day.title"
					:label="day.title"
					:value="day.title"
					class="ml-7"
				)
				v-col(cols='3' class="ml-4")
					timePicker(:day='meetingDay' :index='startTime1')
					timePicker(:day='meetingDay' :index='endTime1')
			v-row(v-if="meetingType != 'Bi-weekly'")
				v-col(v-show="meetingType == 'Other Recurring'" cols='2' class="ml-4")
					v-checkbox(v-for="day in days"
						v-model="checkboxDays"
						:key="day.title"
						:label="day.title"
						:value="day.title"
					)
				v-col(v-if="meetingType != ''")   
					datePicker(v-show="meetingType == 'Other' || meetingType == 'Orientation'" multiple elevation="5" class="ml-4")                                                                                                                 
					v-time-picker(v-model="time1" :allowed-minutes="allowedStep" elevation="5" class="ml-4")
					v-time-picker(v-model="time2" :allowed-minutes="allowedStep" elevation="5" class="ml-4")
			v-btn(color="primary" class="ml-4" @click="setMeeting()" :disabled="disableBtn()") Submit
	template
		v-row
			v-col(class="pa-12")
				v-range-slider(
					:tick-labels="$vuetify.breakpoint.name == 'xs' ? no_tick_labels : tick_labels"
					v-model="range"
					:value="[0,1]"
					:min="min"
					:max="max"
					ticks="always"
					tick-size="4"
				)
					template(v-slot:prepend)
						v-text-field(
							:value="window_times[range[0]]"
							class="mt-0 pt-0"
							single-line
							type="string"
							style="width: 60px"
							@change="$set(range, 0, $event)"
						)
					template(v-slot:append)
						v-text-field(
							:value="window_times[range[1]]"
							class="mt-0 pt-0"
							single-line
							type="string"
							style="width: 60px"
							@change="$set(range, 1, $event)"
						)
				div(class="text-left")
					v-btn(color="primary"
						v-model="best_meeting_times"
						@click="getBestMeetingTime(window_times[range[0]], window_times[range[1]])"
					) Get Team Meeting Times
		div
			h2(class="text-center") {{ days[index].title }}
			v-simple-table
				template
					thead
						tr(class="text-center")
						tr
							td(v-for="time in window_times" :key="time")
								v-chip(:color="getColor(time)" dark large label) {{ time }}
		div(class="text-center")
			v-pagination(
				v-model="page"
				:length="days.length"
				@next="next"
				@previous="prev"
			)
	timeoffEmailForm(
		hidden
		v-if="sendEmail"
		:toName="requesterName"
		:fromName="currentUser"
		:email="requesterEmails[requesterName]"
		:message="emailMessage"
	)
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import '@mdi/font/css/materialdesignicons.css'
import { Component } from 'vue-property-decorator'
import timePicker from '@/components/global/timePicker.vue'
import datePicker from '@/components/global/datePicker.vue'
import store from '@/store'
import {formattedAvailability, availability} from '@/interfaces/GlobalTypes'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'
import timeoffEmailForm from '@/components/global/timeoffEmailForm.vue'

const axios = require('axios')

@Component({
	name: 'Availability',
	components: {
		timePicker,
		datePicker,
		timeoffEmailForm
	},
	extends: ScheduleBase
})

export default class Availability extends ScheduleBase {

	private responsiveWidth: number = 600
	private selected: { [key: string]: string }[] = [] 
	private singleExpand: boolean = false
	private expanded: [] = []
	private startTime1: string = "startTime1"
	private endTime1: string = "endTime1"
	private startTime2: string = "startTime2"
	private endTime2: string = "endTime2"
	private loading: boolean = false
	private loadingText: string = "Loading..."
	private itemsPerRow: number = 10
	private reason: string = ""
	private status: number = 0
	private id: number = 0
	private currentUser: string = store.getters.getUser.first_name
    private requesterName: string = ""
    private sendEmail: boolean = false
    private requesterEmails: {[key: string]: string} = {}
    private emailMessage: string = ""
	private dialog: boolean = false
	private availabilities: formattedAvailability[] = []
	private updateAlert: boolean = false
	private day: string = ""
	private days: { [key: string]: string }[] = [{title: 'Monday'}, {title: 'Tuesday'}, {title: 'Wednesday'}, {title: 'Thursday'}, {title: 'Friday'}]
	private dayIndices: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	private pickedDay: boolean = false
	private picker = null
	private day_time_strings: string[] = []
	private time_suffixes = ['_start_1', '_start_2', '_end_1', '_end_2']
	private time: string = ""
	private no_tick_labels: string[] = []
	private range: number[] = [0, 20]
	private min: number = 0
	private max: number = 20
	private time_binary_list: number[][] = new Array(10)
	private page: number = 1
	private index: number = 0
	private meetingDay: string = ""
	private checkboxDays: string[] = []
	private date: string = store.getters.dateValue.date
	private meetingDays: number[] = []
	private time1: string = ""
	private time2: string = ""
	private attendees: string[] = []
	private meeting_days: string[] = []
	private meetingTypes: { [key: string]: string }[] = [{text: 'Bi-weekly'}, {text: 'Standup'}, {text: 'Orientation'}, {text: 'Other'}, {text: 'Other Recurring'}]
	private meetingType: string = ""
	private disabled: boolean = true
	private maxHours!: number
	private message: string = ''
    private msgType: string = 'primary'
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

	next() {
		this.index = this.index + 1
	}

	prev() {
		this.index = this.index - 1
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
				this.requesterEmails[avail.user.first_name] = avail.user.email
				this.formatAvailabilityTime(avail, this.availabilities)
			})
			this.loading = false
		})
		.catch(function (error: any) {
			console.log(error)
		})
	}
	
	beforeDestroy() {
		if (typeof window === 'undefined') {
			return
		} 

      	window.removeEventListener('resize', this.onResize)
	}

	mounted() {
		this.onResize()

		window.addEventListener('resize', this.onResize, { passive: true })
	}

	onResize() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
		  	this.responsiveWidth = 450
			break
          case 'sm':
		  	this.responsiveWidth = 580
			break
          case 'md':
		  	this.responsiveWidth = 850
			break
          case 'lg':
		  	this.responsiveWidth = 950
			break
          case 'xl':
		  	this.responsiveWidth = 1200
        }
	}

	postSched() {
		this.$axios.post('/schedules/availability/create', {
			'schedule': store.getters.timeValues,
			'maxHours': this.maxHours
		})
		.then((response: any) => {
			this.formatAvailabilityTime(response.data, this.availabilities)
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	triggerDialog(id: number) {
		this.dialog = true
		this.id = id
		this.status = 1
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
			this.requesterName = this.availabilities[removeIndex]['name']
            this.emailMessage = this.writeEmailMessage(this.availabilities[removeIndex])
            this.sendEmail = true
			this.msgType = "success"
			this.message = "Availability successfully approved."
			this.status = 0
			this.reason = ''
			this.id = 0
		})
		.catch((error: AxiosError) => {
			this.msgType = "error"
			this.message = error.response?.data.message
			this.status = 0
		})
	}

	writeEmailMessage(availObj: formattedAvailability) {
        return `Your schedule has been ${availObj.status}. Please see the 'Schedules' tab or visit the calendar to check schedule.`
    }

	denyTimeoff(id: number) {
        var removeIndex = this.availabilities.map(item => item.id).indexOf(id)
        this.availabilities[removeIndex]['status'] = this.parseStatus(2)
        this.requesterName = this.availabilities[removeIndex]['name']
        this.emailMessage = this.writeEmailMessage(this.availabilities[removeIndex])
    	this.sendEmail = true
	}

	disableBtn() {
		return this.selected.length == 0 || !this.meetingType 
	}

	setMeeting() {
		for(let selected_avail of this.selected) {
			this.attendees.push(selected_avail.name)
		}

		if(this.meetingType == 'Standup') {
			this.meetingDays = [1, 2, 3, 4, 5]
			this.date = "2000-01-01"
		} else if(this.meetingType == 'Bi-weekly') {
			this.meetingDays.push(this.dayIndices.indexOf(this.meetingDay))
			this.time1 = store.getters.getDaySched(this.meetingDay)['startTime1']
			this.time2 = store.getters.getDaySched(this.meetingDay)['endTime1']
			this.date = "2000-01-01"
		} else if (this.meetingType == 'Other Recurring') {
			for(let day in this.meetingDays) {
				this.meetingDays.push(this.dayIndices.indexOf(day))
			}
		}
		this.$axios.post('/schedules/meeting/create/', {
			'start': this.time1,
			'end': this.time2,
			'days': this.meetingDays,
			'date': this.date,
			'meeting_type': this.meetingType,
			'attendees': this.attendees
		})
	}

	allowedStep(minutes: number) {
		return minutes % 15 === 0
	}

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
			this.msgType = "success"
			this.message = "Availability updated successfully."
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
			day_lists.push(tuesday_times1)
			day_lists.push(wednesday_times1)
			day_lists.push(thursday_times1)
			day_lists.push(friday_times1)

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