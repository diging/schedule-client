import Vue from 'vue';

export type VForm = Vue & { validate: () => boolean; };

export interface PaginatedResult<T> {
	count: number;
	next?: number;
	previous?: number;
	results: T[];
}

export interface User {
	id: number;
	username: string;
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
    };
}

export interface schedule {
	created: string;
	mon: string;
	tue: string;
	wed: string;
	thu: string;
	fri: string;
	max_hours: string;
}

export interface timeInstance {
    start_time: string;
	end_time: string;
}

export interface timeInstanceRootState {
	start_time: string;
	end_time: string;
}
