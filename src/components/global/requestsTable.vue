<template lang="pug">
    div()
        v-data-table.mt-10(:headers="headers" :items="requests" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
            template(v-slot:item.submission_date="{ item }")
                td {{ formattedDate(item) }}
            template(v-slot:item.status="{ item }")
                v-chip(dark :color="getColor(item.status)") {{ item.status }}
            template(v-slot:item.action="{ item }")
                v-btn.mr-2(fab small dark color="green darken-2" @click="submit('Approved', item)")
                    v-icon mdi-check
                v-dialog(v-model="dialog" width="400")
                    template(v-slot:activator="{ on, attrs }") 
                        v-btn(fab small dark color="red lighten-1" v-bind="attrs" v-on="on")
                            v-icon mdi-close
                    v-card.pa-5
                        h3.mb-5 Reason for declining?
                        v-textarea(v-model="declineReason" outlined)
                        v-divider
                        v-card-actions
                            v-spacer
                            v-btn(text @click="dialog=false") Cancel
                            v-btn(color="#F2594B" dark @click="submit('Declined', item)") Decline 
                        
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import '@mdi/font/css/materialdesignicons.css';
import moment from 'moment';

@Component({
    name: 'requestsTable',
})

export default class requestsTable extends Vue{
    private user: string = '';
    private admin: string = '';    
    private requests: any = [];
    private singleSelect1: boolean = false;
    private selected: any = [];
    private headers: any = [];
    private dialog: boolean = false;
    private declineReason: string= '';

    submit(status: string, item: any) {
        this.$axios.patch('/timeoff/'+item.id+'/review_user_timeoff_request/', {
            status: status,
            reason: this.declineReason,
        })
        .then(function (response: any) {
			console.log(response);
		})
		.catch(function (error: any) {
			console.log(error);
		})
    }

    created() {
        if(this.$route.path == '/userLeaveRequests') {
            this.$axios.get('/timeoff/user/', {
                params: {

                }
            }) 
            .then(response => {
                this.requests=response.data;

                console.log(this.requests);
            })
            .catch(function (error: any) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

            this.headers = [ 
                { text: 'Request type', value: 'timeoff_type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
            ]
        }

        else if(this.$route.path == '/adminLeaveRequests') {
            this.$axios.get('/timeoff/all/', {
                params: {

                }
            }) 
            .then(response => {
                this.requests=response.data;
                for(request of this.requests){
                    if(request.start_time){
                        from_date = formattedDateTime(request.from_date, request.start_time)
                        to_date = formattedDateTime(request.to_date, request.end_time)
                    }
                }
                console.log(this.requests);
            })
            .catch(function (error: any) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

            this.headers = [ 
                { text: 'Applicant', value: 'user' },
                { text: 'Submitted on', value: 'submission_date' },
                { text: 'Request type', value: 'timeoff_type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
                { text: 'Action', value: 'action' },
            ]
        }
    }

    formattedDate(item: any) {
        var date = moment(item.submission_date);
        var dateComponent = date.utc().format('MM/DD/YYYY');
        return dateComponent;
    }

    formattedDateTime(current_date: any, current_time:any) {
        var dateComponent = moment(current_date + ' ' + current_time, 'DD/MM/YYYY HH:mm')
        return dateComponent
    }

    getColor (status: string) {
        if (status == 'pending') return 'grey'
        else if (status == 'Approved') return 'green darken-2'
        else return 'red lighten-1'
    }
}
</script>

<style scoped>

</style>