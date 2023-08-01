<template lang="pug">
v-dialog(v-model="dialog" max-width="500px")
    template(v-slot:activator="{ on, attrs }")
        v-btn(color="#F2594B" class="white--text" medium v-bind="attrs" v-on="on")
            v-icon mdi-plus
            span New Request
    v-card(class="pa-5")
        h4(class="text-center") Leave Request Form
        v-card-text
            v-form(ref="form")
                v-container
                    v-row
                        v-col(cols="12")
                            v-select(v-model="type" :items="['Time Off', 'Sick Leave', 'Additional Work Hours']" label="Request type*" required)
                        v-col(cols="6")
                            v-menu(ref="menuFrom" v-model="menuFrom" :close-on-content-click="false" :return-value.sync="dateFrom"
                                    transition="scale-transition" offset-y min-width="auto")
                                template(v-slot:activator="{ on, attrs }")
                                    v-text-field(v-model="dateFrom" label="From" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                                v-date-picker(v-model="dateFrom" @input="$refs.menuFrom.save(dateFrom); getDayOfWeek(dateFrom)" no-title scrollable)
                                    v-spacer
                                    v-btn(text color="grey" @click="menuFrom = false") Cancel
                        v-col(cols="6")
                            v-menu(ref="menuTo" v-model="menuTo" :close-on-content-click="false" :return-value.sync="dateTo"
                                    transition="scale-transition" offset-y min-width="auto")
                                template(v-slot:activator="{ on, attrs }")
                                    v-text-field(v-model="dateTo" label="To" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                                v-date-picker(v-model="dateTo" @input="$refs.menuTo.save(dateTo)" no-title scrollable)
                                    v-spacer
                                    v-btn(text color="grey" @click="menuTo = false") Cancel
                        v-col(cols="6" v-show="allDay!=true && dateTo==''")
                            timePicker(:day='dayFrom' :index='startTime1')
                        v-col(cols="6" v-show="allDay!=true && dateTo==''")
                            timePicker(:day='dayFrom' :index='endTime1')
                        v-col(cols="6" v-show="dateTo==''")
                            v-checkbox(v-model="allDay" label="All Day" color="#F2594B")
                        v-col(cols="12")
                            v-textarea(outlined name="request description" label="Description" v-model="reason")
        v-card-actions
            v-spacer
            v-btn(color="grey" text @click="dialog = false") Cancel
            v-btn(color="#F2594B" medium class="white--text" :disabled="disableBtn()" @click="dialog = false; submit()") Submit

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import timePicker from '@/components/global/timePicker.vue'
import {ScheduleBase} from '@/components/Bases/ScheduleBase'
import {schedule} from '@/interfaces/GlobalTypes'
import store from '@/store'

@Component({
    name: 'requestForm',
    components: {
        timePicker,
    },
    extends: ScheduleBase
})

export default class requestForm extends ScheduleBase {
    private menuFrom: string = ''
    private dateFrom: string = ''
    private menuTo: string = ''
    private dateTo: string = ''
    private dialog: boolean = false
	private type: string = ''
	private allDay: boolean = false
    private startTime1: string = "startTime1"
	private endTime1: string = "endTime1"
    private reason: string = ''
    private dayFrom: string = ''
    private hours: { [key: string]: string[]} = {}
    private schedule_days: string[] = ['mon_start_1', 'tue_start_1', 'wed_start_1', 'thu_start_1', 'fri_start_1']
    private dayOfWeek: number = 0
    private startTime: string = '00:00:00'
    private endTime: string = '00:00:00'
    
    @Emit('show-alert')
    showAlert(message: string, msgType: string): [string, string] {
        return [message, msgType]
    }

    @Watch('dialog')
    watchDialog() {
        (this.$refs.form as HTMLFormElement).reset()
    }

	submit() {
        if(this.dateTo != '') {
            this.allDay = true
        }
        if(!this.allDay) {
            this.startTime = store.getters.timeValues[this.dayFrom].startTime1
            this.endTime = store.getters.timeValues[this.dayFrom].endTime1
        }
        this.$axios.get('/schedules/user/')
		.then((response: any) => {
            if(response.data.length != 0) {
                let schedule: schedule = response.data[0]
                if(schedule[this.schedule_days[this.dayOfWeek-1]] != "00:00:00") {
                    this.$axios.post('/timeoff/create/', {
                        'start_date': this.dateFrom,
                        'end_date': this.dateTo,
                        'start_time': this.startTime,
                        'end_time': this.endTime,
                        'all_day': this.allDay,
                        'request_type': this.type,
                        'reason': this.reason
                    })
                    .then((response: any) => {
                        this.showAlert("Timeoff request submitted successfully.", "success")
                    })
                    .catch(function (error: any) {
                        console.log(error)
                    })
                } else {
                    this.showAlert("Your 'From' date does not occur on a day that you are working, please select a different day...", "error")
                }
            } else {
                this.showAlert("You must have an approved work schedule before you can make a timeoff request.", "error")
            }
        })
		.catch(function (error: any) {
			console.log(error)
		})
	}

    getDayOfWeek(date: string) {
        this.dayOfWeek = new Date(date).getUTCDay()
        this.dayFrom = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.dayOfWeek]
    }

    disableBtn() {
		return this.type == '' || this.dayFrom == ''
	}
}
</script>

<style scoped>

</style>