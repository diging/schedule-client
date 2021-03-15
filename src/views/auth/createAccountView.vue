<template lang="pug">
    createAccount
</template>

<script>
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import createAccount from '@/components/auth/createAccount.vue'

export default Vue.extend({
    name: "createAccountView",
    components: {
        createAccount,
    },
})
</script>

<style scoped>

</style>
