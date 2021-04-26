<template lang="pug">
    div()
        v-data-table.mt-10(:headers="headers" :items="requests" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
            template(v-slot:item.status="{ item }")
                v-chip(dark :color="getColor(item.status)") {{ item.status }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
    name: 'requestsTable',
})

export default class requestsTable extends Vue{
    private user: string='';
    private admin: string='';    
    private requests: any = [];

    data() {
        return {
            singleSelect1: false,
            selected: [],
            headers: [ 
                { text: 'Request type', value: 'timeoff_type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
            ],
        }
    }


    created() {
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