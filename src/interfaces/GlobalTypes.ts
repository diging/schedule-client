import Vue from 'vue';

export type VForm = Vue & { validate: () => boolean; };

export interface PaginatedResult<T> {
	count: number;
	next?: number;
	previous?: number;
	results: T[];
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
	token_type: string;
	exp: number;
	jti: string;
	user_id: number;
	github_token: boolean;
  }

export interface time {
    startTime1: string;
    startTime2: string;
    endTime1: string;
    endTime2: string;
}

export interface RootState {
	schedule: {
        [key: string] : time
    },
	user: {
		[key: string] : string
	}
}

export interface schedule {
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
	status: number
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

export interface timeInstance {
    start_time: string;
	end_time: string;
}

export interface timeInstanceRootState {
	start_time: string;
	end_time: string;
	// created: string
	// fri_end_1: string
	// fri_end_2: string
	// fri_start_1: string
	// fri_start_2: string
	// id: number
	// max_hours: string
	// mon_end_1: string
	// mon_end_2: string
	// mon_start_1: string
	// mon_start_2: string
	// status: number
	// thur_end_1: string
	// thur_end_2: string
	// thur_start_1: string
	// thur_start_2: string
	// tue_end_1: string
	// tue_end_2: string
	// tue_start_1: string
	// tue_start_2: string
	// user: User
	// wed_end_1: string
	// wed_end_2: string
	// wed_start_1: string
	// wed_start_2: string
}

export interface SideNavItem {
    title: string; icon: string; path: string
}

export interface formattedSchedule {
	[key:string]: string | number | undefined
	created: string
	mon: string
	tue: string
	wed: string
	thu: string
	fri: string
	max_hours: string
	status: string | undefined
	id: number
}
