<template lang="pug">
div
    v-data-table(:headers="employee" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
        template(v-slot:top)
            v-switch(v-model="singleSelect1" label="Single select" class="pa-3")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'employeeTable',
})

export default class employeeTable extends Vue{
    data() {
        return {
            singleSelect1: false,
            selected: [],
            employee: [
                { text: 'Name', value: 'name' },
                { text: 'Date joined', value: 'joinDate' },
                { text: 'Role', value: 'role' },
                { text: 'ACTIONS', value: 'actions' },
            ],
        }
    }
}
</script>

<style scoped>

</style>