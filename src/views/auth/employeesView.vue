<template lang="pug">
    div
        addEmployee
        employeeTable
</template>

<script lang="ts">
import Vue from 'vue'
import addEmployee from '@/components/global/addEmployee.vue'
import employeeTable from '@/components/global/employeeTable.vue'

export default Vue.extend({
    components: {
        addEmployee,
        employeeTable,
    }
    
})
</script>

<style scoped>

</style>