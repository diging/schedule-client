import Vue from 'vue'
import Component from 'vue-class-component'
import {schedule, formattedSchedule, time} from '@/interfaces/GlobalTypes'
import moment from 'moment'

@Component
export class ScheduleBase extends Vue {

	protected maxHours: string = '0.0'

	parseStatus(status: number | undefined) {
		switch(status) {
			case 0:
				return 'Pending'
			case 1:
				return 'Approved'
			case 2:
				return 'Denied'
			default:
				console.log("Nothing")
		}
	}

	parseTime(key: string, schedule: any) {
		let data = moment(schedule[`${key}_start_1`], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule[`${key}_end_1`], 'HH:mm:ss').format('h:mm A')
		if(data === '12:00 AM - 12:00 AM') {
			return 'OFF'
		} else {
			return data
		}
	}

	formatScheduleTime(schedule: schedule, schedules: formattedSchedule[]) {
		let formattedSchedule: formattedSchedule = {
			'created': moment(schedule['created']).format('MM/DD/YYYY'),
			'mon': this.parseTime("mon", schedule),
			'tue': this.parseTime("tue", schedule),
			'wed': this.parseTime("wed", schedule),
			'thu': this.parseTime("thu", schedule),
			'fri': this.parseTime("fri", schedule),
			'max_hours': schedule['max_hours'],
			// this works but vueter doesn't recognize it.
			'status': this.parseStatus(schedule.status),
			'id': schedule.id
		}
		schedules.push(formattedSchedule)
	}

	formatDayTime(times: time) {
		let formatted_day = moment(times['startTime1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(times['endTime1'], 'HH:mm:ss').format('h:mm A')
		if(formatted_day === '12:00 AM - 12:00 AM') {
			return 'OFF'
		} else {
			return formatted_day
		}
	}

	workerHours(schedule: schedule, hours: {[key: string]: any }) {
		for (const key in schedule) {
			const value = schedule[key]
			if (key.indexOf('start') > -1 || key.indexOf('end') > -1) {
				hours[key] = value
			}
		}
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
			let split = this.maxHours.split('.').join("")
			if(split.length > 2) {
				let last = split.slice(-2)
				let rest = split.slice(0, -2)
				this.maxHours = rest + "." + last
			} else {
				this.maxHours = '.' + split
			}
		}
	}
}
