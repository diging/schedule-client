<template lang="pug">
    div()
        v-data-table(:headers="user" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
            template(v-slot:top)
                v-switch(v-model="singleSelect1" label="Single select" class="pa-3")
        v-data-table(:headers="admin" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect2")
            template(v-slot:top)
                v-switch(v-model="singleSelect2" label="Single select" class="pa-3")
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

    data() {
        return {
            singleSelect1: false,
            singleSelect2: false,
            selected: [],
            user: [
                { text: 'Request type' },
                { text: 'From', value: 'From' },
                { text: 'To', value: 'to' },
                { text: 'Reason', value: 'reason' },
                { text: 'STATUS', value: 'status' },
            ],
            admin: [
                { text: 'Applicant', value: 'applicant' },
                { text: 'Request type', value: 'request type' },
                { text: 'From', value: 'from' },
                { text: 'To', value: 'to' },
                { text: 'Reason', value: 'reason' },
                { text: 'Submitted on', value: 'submitted' },
                { text: 'STATUS', value: 'status' },
            ],
        }
    }
}
</script>

<style scoped>

</style>