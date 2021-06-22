

import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export class ScheduleMixin extends Vue {
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
}