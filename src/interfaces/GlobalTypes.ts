import Vue from 'vue';

export type VForm = Vue & { validate: () => boolean; };

export interface PaginatedResult<T> {
	count: number
	next?: number
	previous?: number
	results: T[]
}

export interface User {
	email: string
	first_name: string
	full_name: string
	id: number
	is_superuser: boolean
	last_name: string
}

export interface TokenDto {
	token_type: string
	exp: number
	jti: string
	user_id: number
	github_token: boolean
}

export interface time {
    startTime1: string
    startTime2: string
    endTime1: string
    endTime2: string
}

export interface RootState {
	schedule: {
        [key: string] : time
    },
	date: {
		[key: string] : string
	},
	user: {
		[key: string] : string
	}
}

export interface availability {
	[key: string]: string | undefined | number | User
	created: string
	fri_end_1: string
	fri_end_2: string
	fri_start_1: string
	fri_start_2: string
	id: number
	max_hours: string
	mon_end_1: string
	mon_end_2: string
	mon_start_1: string
	mon_start_2: string
	status: number | undefined
	thur_end_1: string
	thur_end_2: string
	thur_start_1: string
	thur_start_2: string
	tue_end_1: string
	tue_end_2: string
	tue_start_1: string
	tue_start_2: string
	user: User
	wed_end_1: string
	wed_end_2: string
	wed_start_1: string
	wed_start_2: string
}

export interface schedule {
	[key: string]: string | undefined | number | User
	created: string
	fri_end_1: string
	fri_end_2: string
	fri_start_1: string
	fri_start_2: string
	id: number
	mon_end_1: string
	mon_end_2: string
	mon_start_1: string
	mon_start_2: string
	thur_end_1: string
	thur_end_2: string
	thur_start_1: string
	thur_start_2: string
	total_hours: string
	tue_end_1: string
	tue_end_2: string
	tue_start_1: string
	tue_start_2: string
	user: User
	wed_end_1: string
	wed_end_2: string
	wed_start_1: string
	wed_start_2: string
}

export interface SideNavItem {
    title: string; icon: string; path: string
}

export interface formattedAvailability {
	[key: string]: string | undefined | number
	created: string
	mon: string
	tue: string
	wed: string
	thu: string
	fri: string
	max_hours: string
	status: string | undefined
	name: User["first_name"]
	id: number
}

export interface formattedSchedule {
	[key: string]: string | undefined | number | User
	created: string
	mon: string
	tue: string
	wed: string
	thu: string
	fri: string
	total_hours: string
	name: User["first_name"]
	id: number
}

export interface meetings {
	[key: string]: string | string[]
	start: string
	end: string
	days: string[]
	date: string
	meeting_type: string
	attendees: string
}

export interface ITimeoff {
	id: number
	user: User
	start_date: string
	end_date: string
	start_time: string
	end_time: string
	all_day: boolean
	request_type: string
	reason: string
	status: number
	created: string
}

export interface IFormattedTimeoff {
	id: number
	user: User['first_name']
	start_date: string
	end_date: string
	start_time: string
	end_time: string
	all_day: boolean
	request_type: string
	reason: string
	status: string | undefined
	created: string
}
