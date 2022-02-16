
import Vue from 'vue'
import Component from 'vue-class-component'
import {schedule, formattedSchedule} from '@/interfaces/GlobalTypes'
import moment from 'moment'
@Component
export class ScheduleBase extends Vue {


	protected maxHours: string = '0.0'


	parseStatus(status: number) {
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

	timeFormat(schedule: schedule, schedules: schedule[]) {
		let formattedSchedule: formattedSchedule = {
			'created': moment(schedule['created']).format('MM/DD/YYYY'),
			'mon_start_1': moment(schedule['mon_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['mon_end_1'], 'HH:mm:ss').format('h:mm A'),
			'tue_start_1': moment(schedule['tue_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['tue_end_1'], 'HH:mm:ss').format('h:mm A'),
			'wed_start_1': moment(schedule['wed_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['wed_end_1'], 'HH:mm:ss').format('h:mm A'),
			'thu_start_1': moment(schedule['thur_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['thur_end_1'], 'HH:mm:ss').format('h:mm A'),
			'fri_start_1': moment(schedule['fri_start_1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(schedule['fri_end_1'], 'HH:mm:ss').format('h:mm A'),
			'max_hours': schedule['max_hours'],
			// this works but vueter doesn't recognize it.
			'status': this.parseStatus(schedule['status']),
			'id': schedule.id
		}
		for (const [key, value] of Object.entries(formattedSchedule)) {
			if(value === '12:00 AM - 12:00 AM') {
				formattedSchedule[key] = 'OFF'
			}
		}
		schedules.push(formattedSchedule)
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
}