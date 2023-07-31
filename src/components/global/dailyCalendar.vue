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
            :event-ripple="false"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="dateRange"
            @mousedown:event="startDrag"
            @mousedown:time="startTime"
            @mousemove:time="mouseMove"
            @mouseup:time="endDrag"
            @mouseleave.native="cancelDrag"
        )
            template(v-if="type=='day'" v-slot:event="{ event, timed, eventSummary }")
                div(class="v-event-draggable")
                    component(:is="{ render: eventSummary }")
                div(
                    class="v-event-drag-bottom"
                    @mousedown.stop="extendBottom(event)"
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
    private colorDict: { [key: string]: string } = {}
    private colors: { [key: string]: string[] } = {
        'schedule': [
            'blue-grey darken-3',
            'green darken-3',
            'orange lighten-1',
            'purple darken-1',
            'blue accent-3',
            'pink accent-1',
            'teal lighten-3',
            'lime lighten-2',
            'blue darken-4',
            'light-green accent-3',
            'brown darken-1',
            'grey lighten-1'
        ],
        'meeting': [
            'cyan darken-1',
            'orange darken-3',
            'green accent-3',
            'yellow accent-2',
            'red darken-1'
        ]
    }
    private schedColorIndex: number = 0
    private meetingColorIndex: number = 0
    private student_workers: string[] = []
    private hours: { [key: string]: string[]} = {}
    private days: { [key: number]: string } = {[1]: 'mon', [2]: 'tue', [3]: 'wed', [4]: 'thu', [5]: 'fri'}
    private types = ['month', 'day']
    private type = 'month'
    private weekdays = [1, 2, 3, 4, 5]
    private responsiveWidth: number = 600
    private nextDate!: moment.Moment
    private currentDay: number = 0
    private calendarEvents: any[] = []
    private dragTime: any = null
    private dragEvent: any = null
    private dragStart: any = null
    private createEvent: any = null
    private createStart: any = null
    private extendOriginal: any = null

    startDrag({ event, timed }: any) {
        if (event && timed) {
          this.dragEvent = event
          this.dragTime = null
          this.extendOriginal = null
        }
    }

    startTime (tms: any) {
        const mouse = this.toTime(tms)

        if (this.dragEvent && this.dragTime === null) {
          const start = this.dragEvent.start
          this.dragTime = mouse - start
        }
    }
    
    roundTime (time: any, down = true) {
        const roundTo = 15 // minutes
        const roundDownTime = roundTo * 60 * 1000

        return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    }

    toTime (tms: any) {
        return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    }

    extendBottom (event: any) {
        this.createEvent = event
        this.createStart = event.start
        this.extendOriginal = event.end
    }

    mouseMove (tms: any) {
        const mouse = this.toTime(tms)

        if (this.dragEvent && this.dragTime !== null) {
            const start = this.dragEvent.start
            const end = this.dragEvent.end
            const duration = end - start
            const newStartTime = mouse - this.dragTime
            const newStart = this.roundTime(newStartTime)
            const newEnd = newStart + duration

            this.dragEvent.start = newStart
            this.dragEvent.end = newEnd
        } else if (this.createEvent && this.createStart !== null) {
            const mouseRounded = this.roundTime(mouse, false)
            const min = Math.min(mouseRounded, this.createStart)
            const max = Math.max(mouseRounded, this.createStart)

            this.createEvent.start = min
            this.createEvent.end = max
        }
    }

    endDrag () {
        this.dragTime = null
        this.dragEvent = null
        this.createStart = null
        this.createEvent = null
        this.extendOriginal = null
    }

    cancelDrag () {
        if (this.createEvent) {
            if (this.extendOriginal) {
                this.createEvent.end = this.extendOriginal
            } else {
                const i = this.events.indexOf(this.createEvent)
                if (i !== -1) {
                    this.events.splice(i, 1)
                }
            }
        }

        this.createEvent = null
        this.createStart = null
        this.dragTime = null
        this.dragEvent = null
    }

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

    getColor(calendarEvent: string, field: any, index: number) {
        this.colorDict[field] = this.colors[calendarEvent][index]
        return this.colorDict[field]
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

    editEvent() {

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

    getMonthStart(start: string, weekStart: number): [string, number] {
        let start_date = moment.utc(start)
        if (weekStart == 6) {
            start = start_date.date(start_date.date() + 2).format('YYYY-MM-DD')
            weekStart = 1
        }
        if (weekStart == 0) {
            start = start_date.date(start_date.date() + 1).format('YYYY-MM-DD')
            weekStart = 1
        }
        return [start, weekStart]
    }

    getNextDayofMonth(start_date: moment.Moment, current_day: number) {
        let next_date = moment(start_date.set('date', start_date.date() + 1))
        if (next_date.day() === 0) {
            next_date = moment(start_date.set('date', start_date.date() + 1))
            current_day++
        }
        if (next_date.day() === 6) {
            next_date = moment(start_date.set('date', start_date.date() + 2))
            current_day = current_day + 2
        }
        this.nextDate = next_date
        this.currentDay = current_day
    }

    deleteSchedConflicts(events: any[], timeoff: ITimeoff) {
        const filteredEvents = events.filter(
            (event) =>
                event.type === "Schedule" &&
                event.user === timeoff.user.id &&
                (event.day >= parseInt(timeoff.start_date.split("-")[2]) && event.day <= parseInt(timeoff.end_date.split("-")[2]))
        )
        if (filteredEvents.length > 0) {
            this.calendarEvents.splice(filteredEvents[0].index, filteredEvents.length)
        }
    }

    fetchEvents(start: string, end: string, weekStart: number) {
        this.calendarEvents = []
        let eventIndex = 0
        this.student_workers = []
        this.colorDict = {}
        this.schedColorIndex = 0
        this.meetingColorIndex = 0
        let [initial_start, weekDay] = this.getMonthStart(start, weekStart)
        let start_month = weekDay
        start = initial_start
        let start_date = moment.utc(initial_start)
        let end_date = moment.utc(end)
        this.$axios.get('/schedules/list/')
		.then(response => {
            response.data.forEach((schedule: schedule) => {
                if (!this.student_workers.includes(schedule.user.full_name)) {
                    this.student_workers.push(schedule.user.full_name)
                }
                this.workerHours(schedule, this.hours)
                let current_day = start_date.date()
                let last_day = end_date.date()
                let workerColor = this.getColor('schedule', schedule.user.first_name, this.schedColorIndex++)
                while (current_day <= last_day) {
                    let weekday = this.days[this.getWeekday(weekStart)]
                    let shift_start = this.hours[weekday][0]
                    let shift_end = this.hours[weekday][1]
                    if(shift_start != '00:00:00') {
                        this.calendarEvents.push({
                            start: new Date(start.concat('T', shift_start)),
                            end: new Date(start.concat('T', shift_end)),
                            startDate: start,
                            weekday: weekday,
                            color: workerColor,
                            timed: true,
                            user: schedule.user.id,
                            name: schedule.user.full_name,
                            timeRange: `${shift_start} - ${shift_end}`,
                            day: current_day,
                            type: "Schedule",
                            index: eventIndex++
                        })
                    }
                    this.getNextDayofMonth(start_date, current_day)
                    start = this.nextDate.format("YYYY-MM-DD")
                    weekStart++
                    current_day = ++this.currentDay
                }
                start = initial_start
                start_date = moment.utc(start)
                weekStart = start_month
                this.hours = {}
            })
            this.$axios.get('/schedules/meetings/list/')
            .then(response => {
                response.data.forEach((meeting: meetings) => {
                    let meetingColor = this.getColor('meeting', meeting.meeting_type, this.meetingColorIndex++)
                    if(meeting.meeting_type == "Standup" || meeting.meeting_type == "Bi-weekly") {
                        let current_day = start_date.date()
                        let last_day = end_date.date()
                        while (current_day <= last_day) {
                            let weekday = this.getWeekday(weekStart).toString()
                            if(meeting.days.includes(weekday)) {
                                this.calendarEvents.push({
                                    start: new Date(start.concat('T', meeting.start)),
                                    end: new Date(start.concat('T', meeting.end)),
                                    color: meetingColor,
                                    timed: true,
                                    category: meeting.attendees,
                                    name: meeting.meeting_type,
                                    timeRange: `${meeting.start} - ${meeting.end}`,
                                    type: "Meeting",
                                    index: eventIndex++
                                })
                            }
                            this.getNextDayofMonth(start_date, current_day)
                            start = this.nextDate.format("YYYY-MM-DD")
                            weekStart++
                            current_day = ++this.currentDay
                        }
                    } else {
                        this.calendarEvents.push({
                            start: new Date(meeting.date.concat('T', meeting.start)),
                            end: new Date(meeting.date.concat('T', meeting.end)),
                            color: meetingColor,
                            timed: true,
                            category: meeting.attendees,
                            name: meeting.meeting_type,
                            timeRange: `${meeting.start} - ${meeting.end}`
                        })
                    }
                    start = initial_start
                    start_date = moment.utc(start)
                    weekStart = start_month
                })
                this.$axios.get('/timeoff/all/')
                .then(response => {
                    response.data.forEach((timeoff: ITimeoff) => {
                        let end_date = new Date(timeoff.start_date.concat('T', timeoff.end_time))
                        if (timeoff.status === 1 && timeoff.all_day) {
                            if (timeoff.end_date != null) {
                                end_date = new Date(timeoff.end_date.concat('T', timeoff.end_time))
                            }
                            this.calendarEvents.push({
                                start: new Date(timeoff.start_date.concat('T', timeoff.start_time)),
                                end: end_date,
                                color: this.colorDict[timeoff.user.first_name],
                                timed: true,
                                category: timeoff.user,
                                name: `${timeoff.user.first_name} Not Working`,
                                timeRange: '',
                                type: "Timeoff",
                                index: eventIndex++
                            })
                            this.deleteSchedConflicts(this.calendarEvents, timeoff)
                        } else {
                            let start_timeoff = parseInt(timeoff.start_time.split(':')[0]) + (parseInt(timeoff.start_time.split(':')[1]) / 60)
                            for (let event of this.calendarEvents) {
                                if (event.startDate == timeoff.start_date && event.user == timeoff.user.id) {
                                    let start_sched = parseInt(event.start.getHours()) + (parseInt(event.start.getMinutes()) / 60)
                                    if (start_timeoff - start_sched == 0) {
                                        event.start = new Date(timeoff.start_date.concat('T', timeoff.end_time))
                                        event.name = `${timeoff.user.first_name} Working ${moment(timeoff.end_time, 'HH:mm:ss').format('HH:mm A')} - ${moment(event.end).format('hh:mm A')}`
                                    } else {
                                        event.end = new Date(timeoff.start_date.concat('T', timeoff.start_time))
                                        event.name = `${timeoff.user.first_name} Working ${moment(event.start).format('hh:mm A')} - ${moment(timeoff.start_time, 'HH:mm:ss').format('hh:mm A')}`
                                    }
                                }
                            }
                        }
                    })
                })
            })
        })
        return this.calendarEvents
    }
}
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>