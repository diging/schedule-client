<template lang="pug">
div
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
    v-sheet(height="1100" width="1200")
        v-calendar(ref="calendar"
            v-model="focus"
            color="primary"
            :weekdays="weekdays"
            :categories="student_workers"
            :type="type"
            :events="events"
            :event-color="getEventColor"
            @change="dateRange")

</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component'
import {schedule, meetings} from '@/interfaces/GlobalTypes'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'

@Component({
    name: 'dailyCalendar',
    extends: ScheduleBase
})

export default class dailyCalendar extends ScheduleBase {

    private focus: string = ''
    private events: { [key: string]: string | Date | boolean }[] = []
    private colors: string[] = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
    private student_workers: string[] = []
    private hours: { [key: string]: string[]} = {}
    private mock_hours: { [key: string]: string[] } = {'mon': ['09:00', '10:00'], 'tue': ['12:00', '13:00'], 'wed': ['08:00', '14:00'],
    'thu': ['07:30', '03:30'], 'fri': ['10:00', '04:30']}
    private days: { [key: number]: string } = {[1]: 'mon', [2]: 'tue', [3]: 'wed', [4]: 'thu', [5]: 'fri'}
    private types = ['month', 'day']
    private type = 'month'
    private day_times: { [key: string]: string[] } = {'mon': ['9:00', '10:00'], 'tue': ['0:00', '0:00'], 'wed': ['0:00', '0:00'],'thu': ['0:00', '0:00'], 'fri': ['0:00', '0:00']}
    private attendees = ['Bob', 'Susie']
    private weekdays = [1, 2, 3, 4, 5]

    mounted() {
        (this.$refs.calendar as Vue & {checkChange: () => void}).checkChange()
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

    dateRange({ start, end }: any) {
        this.events = this.fetchEvents(start.date, end.date, start.weekday)
    }

    getWeekday(day: number) {
        let day_remainder = day % 5
        if (day_remainder == 0) {
            day_remainder = 5
        }
        return day_remainder
    }

    getMonthStart(start: string, weekday: number) {
        let start_date = new Date(`${start}T00:00:00`)
        if (weekday == 6) {
            start = new Date(start_date.setDate(start_date.getDate() + 2)).toISOString().split('T')[0]
        }
        if (weekday == 0) {
            start = new Date(start_date.setDate(start_date.getDate() + 1)).toISOString().split('T')[0]
        }
        return start
    }

    fetchEvents(start: any, end: any, weekStart: number)  {
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
                let current_day = start_date.getDate()
                let last_day = end_date.getDate()
                while (current_day <= last_day) {
                    let weekday = this.days[this.getWeekday(weekStart)]
                    let shift_start = this.hours[weekday][0]
                    let shift_end = this.hours[weekday][1]
                    events.push({
                        start: new Date(start.toString().concat('T', shift_start)),
                        end: new Date(start.toString().concat('T', shift_end)),
                        weekday: weekday,
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                        timed: true,
                        name: schedule.user.full_name
                    })
                    let next_date = new Date(start_date.setDate(start_date.getDate() + 1))
                    if (next_date.getDay() == 0) {
                        next_date = new Date(start_date.setDate(start_date.getDate() + 1))
                        current_day++
                    }
                    if (next_date.getDay() == 6) {
                        next_date = new Date(start_date.setDate(start_date.getDate() + 2))
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
            this.$axios.get('/schedules/meetings/list')
            .then(response => {
                response.data.forEach((meeting: meetings) => {
                    let current_day = start_date.getDate()
                    let last_day = end_date.getDate()
                    while (current_day <= last_day) {
                        let weekday = this.getWeekday(weekStart)
                        if(weekday === meeting.day) {
                            events.push({
                                start: new Date(start.toString().concat('T', meeting.start)),
                                end: new Date(start.toString().concat('T', meeting.end)),
                                color: this.colors[this.rnd(0, this.colors.length - 1)],
                                timed: true,
                                category: meeting.attendees,
                                name: meeting.meeting_type
                            })
                        }
                        let next_date = new Date(start_date.setDate(start_date.getDate() + 1))
                        if (next_date.getDay() == 0) {
                            next_date = new Date(start_date.setDate(start_date.getDate() + 1))
                            current_day++
                        }
                        if (next_date.getDay() == 6) {
                            next_date = new Date(start_date.setDate(start_date.getDate() + 2))
                            current_day = current_day + 2
                        }
                        start = next_date.toISOString().split('T')[0]
                        weekStart++
                        current_day++
                    }
                    start = initial_start
                    start_date = new Date(`${start}T00:00:00`)
                    weekStart = start_month
                })
            })
        })
        return events
    }

    rnd(a: number, b: number) {
        return Math.floor((b - a + 1) * Math.random()) + a
    }

}
</script>

<style scoped>

</style>