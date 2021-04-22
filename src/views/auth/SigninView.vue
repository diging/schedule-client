<template lang="pug">
    Signin
</template>

<script>
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import Signin from '@/components/auth/Signin.vue'

export default Vue.extend({
    name: "SigninView",
    components: {
        Signin,
    },
})
</script>

<style scoped>

</style>
