<template lang="pug">
v-dialog(v-model="dialog" max-width="500px")
    template(v-slot:activator="{ on, attrs }")
        v-btn(color="#F2594B" class="white--text" medium v-bind="attrs" v-on="on")
            v-icon mdi-plus
            span New Request
    v-card(class="pa-5")
        h4(class="text-center") Leave Request Form
        v-card-text
            v-container
                v-row
                    v-col(cols="12")
                        v-select(v-model="type" :items="['Time Off', 'Sick Leave', 'Additional Work Hours']" label="Request type*" required)
                    v-col(cols="6")
                        v-menu(ref="menuFrom" v-model="menu1" :close-on-content-click="false" :return-value.sync="dateFrom"
                                transition="scale-transition" offset-y min-width="auto")
                            template(v-slot:activator="{ on, attrs }")
                                v-text-field(v-model="dateFrom" label="From" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                            v-date-picker(v-model="dateFrom" no-title scrollable)
                                v-spacer
                                v-btn(text color="grey" @click="menuFrom = false") Cancel
                                v-btn(text color="#F2594B" @click="$refs.menuFrom.save(dateFrom); getDayOfWeek(dateFrom)") OK
                    v-col(cols="6")
                        v-menu(ref="menuTo" v-model="menu2" :close-on-content-click="false" :return-value.sync="dateTo"
                                transition="scale-transition" offset-y min-width="auto")
                            template(v-slot:activator="{ on, attrs }")
                                v-text-field(v-model="dateTo" label="To" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                            v-date-picker(v-model="dateTo" no-title scrollable)
                                v-spacer
                                v-btn(text color="grey" @click="menuTo = false") Cancel
                                v-btn(text color="#F2594B" @click="$refs.menuTo.save(dateTo)") OK
                    v-col(cols="6" v-show="type=='Time Off' && allDay!=true && dateTo==''")
                        timePicker(:day='dayFrom' :index='startTime1')
                    v-col(cols="6" v-show="type=='Time Off' && allDay!=true && dateTo==''")
                        timePicker(:day='dayFrom' :index='endTime1')
                    v-col(cols="6" v-show="type=='Time Off'")
                        v-checkbox(v-model="allDay" label="All Day" color="#F2594B")
                    v-col(cols="12")
                        v-textarea(outlined name="request description" label="Description" v-model="reason")
        v-card-actions
            v-spacer
            v-btn(color="grey" text @click="dialog = false") Cancel
            v-btn(color="#F2594B" medium class="white--text" @click="dialog = false; submit()") Submit

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store'

@Component({
    name: 'requestForm',
    components: {
        timePicker,
    }
})

export default class requestForm extends Vue {
    private menu1: string = ''
    private dateFrom: string = ''
    private menu2: string = ''
    private dateTo: string = ''
    private dialog: boolean = false
	private type: string = ''
	private allDay: boolean = false
    private startTime1: string = "startTime1"
	private endTime1: string = "endTime1"
    private reason: string = ''
    private dayFrom: string = ''

	submit() {
        console.log("TYPE: ", this.type)
        console.log("FROM DATE: ", this.dateFrom)
        console.log("NEW FROM DATE: ", new Date(`${this.dateFrom}T00:00:00`))
        console.log("TO DATE: ", this.dateTo)
        console.log("LEAVE TYPE: ", this.type)
        console.log("ALL DAY: ", this.allDay)
        this.$axios.post('/timeoff/create/', {
            'start_date': this.dateFrom,
            'end_date': this.dateTo,
            'start_time': store.getters.timeValues[this.dayFrom].startTime1,
            'end_time': store.getters.timeValues[this.dayFrom].endTime1,
            'all_day': this.allDay,
            'request_type': this.type,
            'reason': this.reason,
		})
		.then((response: any) => {
        })
		.catch(function (error: any) {
			console.log(error);
		})
	}

    getDayOfWeek(date: string) {
        const dayOfWeek = new Date(date).getDay()
        this.dayFrom = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
    }
}
</script>

<style scoped>

</style>