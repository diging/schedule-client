export interface timePickerType {
    name: string;
    day: string;
    time: string;
}

export interface time {
    startTime1: string;
    startTime2: string;
    endTime1: string;
    endTime2: string;
}

export interface timeoffRequest {
    timeoff_type: string;
    from_date: string;
    to_date: string;
    description: string;
    status: string;
    start_time: string;
    end_time: string;
}