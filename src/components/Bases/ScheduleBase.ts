import Vue from 'vue'
import Component from 'vue-class-component'
import {availability, formattedAvailability, formattedSchedule, time, schedule} from '@/interfaces/GlobalTypes'
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

	parseTime(key: string, avail: any) {
		let data = moment(avail[`${key}_start_1`], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(avail[`${key}_end_1`], 'HH:mm:ss').format('h:mm A')
		if(data === '12:00 AM - 12:00 AM') {
			return 'OFF'
		} else {
			return data
		}
	}

	formatAvailabilityTime(avail: availability, avails: formattedAvailability[]) {
		let formattedAvail: formattedAvailability = {
			'created': moment(avail['created']).format('MM/DD/YYYY'),
			'mon': this.parseTime("mon", avail),
			'tue': this.parseTime("tue", avail),
			'wed': this.parseTime("wed", avail),
			'thu': this.parseTime("thu", avail),
			'fri': this.parseTime("fri", avail),
			'max_hours': avail['max_hours'],
			// this works but vueter doesn't recognize it.
			'status': this.parseStatus(avail.status),
			'id': avail.id,
			'name': avail.user["first_name"]
		}
		avails.push(formattedAvail)
	}

	formatScheduleTime(sched: schedule, scheds: formattedSchedule[]) {
		let formattedSched: formattedSchedule = {
			'created': moment(sched['created']).format('MM/DD/YYYY'),
			'mon': this.parseTime("mon", sched),
			'tue': this.parseTime("tue", sched),
			'wed': this.parseTime("wed", sched),
			'thu': this.parseTime("thu", sched),
			'fri': this.parseTime("fri", sched),
			'total_hours': sched['total_hours'],
			// this works but vueter doesn't recognize it.
			'id': sched.id,
			'name': sched.user["first_name"]
		}
		scheds.push(formattedSched)
	}

	formatDayTime(times: time) {
		let formatted_day = moment(times['startTime1'], 'HH:mm:ss').format('h:mm A') + ' - ' + moment(times['endTime1'], 'HH:mm:ss').format('h:mm A')
		if(formatted_day === '12:00 AM - 12:00 AM') {
			return 'OFF'
		} else {
			return formatted_day
		}
	}

	workerHours(sched: schedule, hours: {[new_key: string]: any[] }) {
		for (const key in sched) {
			const value = sched[key]
			const new_key = key.substring(0,3)
			if (key.indexOf('start') > -1) {
				if (typeof hours[new_key] !== 'undefined' && hours[new_key].length > 0) {
					hours[new_key][2] = value
				} else {
                    hours[new_key] = []
                    hours[new_key][0] = value
                }
			}

			if (key.indexOf('end') > -1) {
				if (hours[new_key].length > 1) {
					hours[new_key][3] = value
				} else {
                    hours[new_key][1] = value
                }
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
