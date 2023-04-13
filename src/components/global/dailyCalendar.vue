<template lang="pug">
v-card(:width="responsiveWidth")
    v-sheet(tile height="64" class="d-flex")
        v-toolbar(flat)
            v-select(
                v-model="type"
                :items="types"
                dense
                outlined
                hide-details
                class="ma-2"
                label="type"
            )
            v-btn(outlined class="mr-4" color="grey darken-2" @click="setToday()") Today
            v-btn(fab text small color="grey darken-2" @click="prev()")
                v-icon(small) mdi-chevron-left
            v-btn(fab text small color="grey darken-2" @click="next()")
                v-icon(small) mdi-chevron-right
            v-toolbar-title(v-if="$refs.calendar") {{ $refs.calendar.title }}
    v-sheet
        v-calendar(
            ref="calendar"
            v-model="focus"
            color="primary"
            :weekdays="weekdays"
            :categories="student_workers"
            :type="type"
            :events="events"
            :event-color="getEventColor"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="dateRange"
        )
        v-menu(
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        )
            v-card(
                color="grey lighten-4"
                min-width="350px"
                flat
            )
                v-toolbar(
                    :color="selectedEvent.color"
                    dark
                )
                    v-btn(icon)
                        v-icon mdi-pencil
                    v-toolbar-title(v-html="selectedEvent.name")
                    v-spacer
                    v-btn(icon)
                        v-icon mdi-heart
                    v-btn(icon)
                        v-icon mdi-dots-vertical
                v-card-text
                    span(v-html="selectedEvent.timeRange")
                v-card-actions
                    v-btn(
                        text
                        color="secondary"
                        @click="selectedOpen = false"
                    ) Cancel
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component'
import {schedule, meetings, ITimeoff} from '@/interfaces/GlobalTypes'
import {ScheduleBase} from '@/components/Bases/ScheduleBase'
import moment from 'moment'

@Component({
    name: 'dailyCalendar',
    extends: ScheduleBase
})

export default class dailyCalendar extends ScheduleBase {

    private focus: string = ''
    private events: { [key: string]: string | Date | boolean }[] = []
    private selectedEvent: {} = {}
    private selectedElement = null
    private selectedOpen: boolean = false
    private colors: { [key: string]: string } = {
        'Doug': 'blue-grey darken-3', 'Susie': 'blue darken-4',
        'Bob': 'green darken-3', 'Standup': 'red darken-4',
        'Bi-weekly': 'cyan darken-1', 'Orientation': 'orange darken-3',
        'Other': 'green accent-3', 'Other Recurring': 'yellow accent-2'
    }
    private student_workers: string[] = []
    private hours: { [key: string]: string[]} = {}
    private days: { [key: number]: string } = {[1]: 'mon', [2]: 'tue', [3]: 'wed', [4]: 'thu', [5]: 'fri'}
    private types = ['month', 'day']
    private type = 'month'
    private weekdays = [1, 2, 3, 4, 5]
    private responsiveWidth: number = 600

    beforeDestroy() {
		if (typeof window === 'undefined') {
			return
		} 

      	window.removeEventListener('resize', this.onResize)
	}

    mounted() {
        (this.$refs.calendar as Vue & {checkChange: () => void}).checkChange()

        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
    }

	onResize() {
        switch (this.$vuetify.breakpoint.name) {
            case 'xs':
		  	this.responsiveWidth = 400
            break
          case 'sm': 
		  	this.responsiveWidth = 600
            break
          case 'md': 
		  	this.responsiveWidth = 900
            break
          case 'lg':
            this.responsiveWidth = 950
            break
          case 'xl':
		  	this.responsiveWidth = 1200
        }
    }

    getEventColor(event: any) {
        return event.color                                                                                                                          
    }

    setToday() {
        this.focus = ''
    }

    prev() {
        (this.$refs.calendar as Vue & {prev: () => void}).prev()
    }
    
    next() {
        (this.$refs.calendar as Vue & {next: () => void}).next()
    }

    showEvent({ nativeEvent, event }: any) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
    }

    viewDay({ date }: any) {
        this.focus = date
        this.type = 'day'
    }

    dateRange({ start, end }: any) {
        this.events = this.fetchEvents(start.date, end.date, start.weekday)
    }

    getWeekday(day: number) {
        let day_remainder = day % 5
        if (day_remainder === 0) {
            day_remainder = 5
        }
        return day_remainder
    }

    getMonthStart(start: string, weekday: number) {
        //DS-40 MomentJS conversion starting point
        let start_date = new Date(`${start}T00:00:00`)
        //let start_date1 = moment.utc(start)
        //console.log("NATIVE: ", new Date(start_date.setUTCDate(start_date.getUTCDate() + 2)).toISOString().split('T')[0])
        //console.log("MOMENT: ", start_date1.date(start_date1.date() + 2).format('YYYY-MM-DD'))
        if (weekday == 6) {
            start = new Date(start_date.setUTCDate(start_date.getUTCDate() + 2)).toISOString().split('T')[0]
        }
        if (weekday == 0) {
            start = new Date(start_date.setUTCDate(start_date.getUTCDate() + 1)).toISOString().split('T')[0]
        }
        return start
    }

    fetchEvents(start: string, end: string, weekStart: number)  {
        const events: any[] = []
        this.student_workers = []
        let start_month = weekStart
        let initial_start = this.getMonthStart(start, weekStart)
        let start_date = new Date(`${initial_start}T00:00:00`)
        let end_date = new Date(`${end}T00:00:00`)
        this.$axios.get('/schedules/list/')
		.then(response => {
            response.data.forEach((schedule: schedule) => {
                if (!this.student_workers.includes(schedule.user.full_name)) {
                    this.student_workers.push(schedule.user.full_name)
                }
                this.workerHours(schedule, this.hours)
                let current_day = start_date.getUTCDate()
                let last_day = end_date.getUTCDate()
                while (current_day <= last_day) {
                    let weekday = this.days[this.getWeekday(weekStart)]
                    let shift_start = this.hours[weekday][0]
                    let shift_end = this.hours[weekday][1]
                    if(shift_start != '00:00:00') {
                        events.push({
                            start: new Date(start.concat('T', shift_start)),
                            end: new Date(start.concat('T', shift_end)),
                            weekday: weekday,
                            color: this.colors[schedule.user.first_name],
                            timed: true,
                            user: schedule.user.id,
                            name: schedule.user.full_name,
                            timeRange: `${shift_start} - ${shift_end}`,
                            day: current_day
                        })
                    }
                    let next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 1))
                    if (next_date.getUTCDay() === 0) {
                        next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 1))
                        current_day++
                    }
                    if (next_date.getUTCDay() === 6) {
                        next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 2))
                        current_day = current_day + 2
                    }
                    start = next_date.toISOString().split('T')[0]
                    weekStart++
                    current_day++
                }
                start = initial_start
                start_date = new Date(`${start}T00:00:00`)
                weekStart = start_month
                this.hours = {}
            })
            this.$axios.get('/schedules/meetings/list/')
            .then(response => {
                response.data.forEach((meeting: meetings) => {
                    if(meeting.meeting_type == "Standup" || meeting.meeting_type == "Bi-weekly") {
                        let current_day = start_date.getUTCDate()
                        let last_day = end_date.getUTCDate()
                        while (current_day <= last_day) {
                            let weekday = this.getWeekday(weekStart).toString()
                            if(meeting.days.includes(weekday)) {
                                events.push({
                                    start: new Date(start.concat('T', meeting.start)),
                                    end: new Date(start.concat('T', meeting.end)),
                                    color: this.colors[meeting.meeting_type],
                                    timed: true,
                                    category: meeting.attendees,
                                    name: meeting.meeting_type,
                                    timeRange: `${meeting.start} - ${meeting.end}`
                                })
                            }
                            let next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 1))
                            if (next_date.getUTCDay() === 0) {
                                next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 1))
                                current_day++
                            }
                            if (next_date.getUTCDay() === 6) {
                                next_date = new Date(start_date.setUTCDate(start_date.getUTCDate() + 2))
                                current_day = current_day + 2
                            }
                            start = next_date.toISOString().split('T')[0]
                            weekStart++
                            current_day++
                        }
                    } else {
                        events.push({
                            start: new Date(meeting.date.concat('T', meeting.start)),
                            end: new Date(meeting.date.concat('T', meeting.end)),
                            color: this.colors[meeting.meeting_type],
                            timed: true,
                            category: meeting.attendees,
                            name: meeting.meeting_type,
                            timeRange: `${meeting.start} - ${meeting.end}`
                        })
                    }
                    start = initial_start
                    start_date = new Date(`${start}T00:00:00`)
                    weekStart = start_month
                })
                this.$axios.get('/timeoff/all/')
                .then(response => {
                    response.data.forEach((timeoff: ITimeoff) => {
                        let allDay = false
                        let end_date = new Date(timeoff.start_date.concat('T', timeoff.end_time))
                        if(timeoff.status === 1) {
                            let start_day = timeoff.start_date.split('-')[2]
                            if(timeoff.all_day) {
                                allDay = true
                                if(timeoff.end_date != null) {
                                end_date = new Date(timeoff.end_date.concat('T', timeoff.end_time))
                                }
                                events.push({
                                    start: new Date(timeoff.start_date.concat('T', timeoff.start_time)),
                                    end: end_date,
                                    color: this.colors[timeoff.user.first_name],
                                    timed: !allDay,
                                    category: timeoff.user,
                                    name: `${timeoff.user.first_name} Not Working`,
                                    timeRange: `${timeoff.request_type}`
                                })
                            } else {
                                let start_timeoff = parseInt(timeoff.start_time.split(':')[0]) + (parseInt(timeoff.start_time.split(':')[1]) / 60)
                                for(let event of events) {
                                    if(event.day == start_day && event.user == timeoff.user.id) {
                                        let start_sched = parseInt(event.start.getHours()) + (parseInt(event.start.getMinutes()) / 60)
                                        let diff: number = start_timeoff - start_sched
                                        if(diff == 0) {
                                            event.start = new Date(timeoff.start_date.concat('T', timeoff.end_time))
                                            event.name = `${timeoff.user.first_name} Working ${moment(timeoff.end_time, 'HH:mm:ss').format('HH:mm A')} - ${moment(event.end).format('hh:mm A')}`
                                        } else {
                                            event.end = new Date(timeoff.start_date.concat('T', timeoff.start_time))
                                            event.name = `${timeoff.user.first_name} Working ${moment(event.start).format('hh:mm A')} - ${moment(timeoff.start_time, 'HH:mm:ss').format('hh:mm A')}`
                                        }
                                    }
                                }
                            }
                        }
                    })
                })
            })
        })
        return events
    }
}
</script>

<style scoped>

</style>