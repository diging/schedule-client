<template lang="pug">
    v-card(class="pa-10 ma-auto text-center" width="300")
        h2(class="mb-8") Welcome.
        v-form(ref="form")
            v-text-field(v-model="email" label="Email" required)
            v-text-field(class="mb-5" v-model="password" label="Password" required)
            v-btn(color="#F2594B" class="white--text mb-5" medium v-on:click="login()") Sign In
            v-btn(plain medium to="createAccount") Create Account

</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';

@Component({
	name: 'Signin',
})

export default class Signin extends Vue{
    private email: string='';
    private password: string='';

    setup() {
        
    }

    login() {
        if(this.email != "" && this.password != "") {
            if(this.email == "admin" && this.password == "admin") {
                this.$router.push({ name: "adminHome" });
            } else if(this.email == "user" && this.password == "user"){
                this.$router.push({ name: "userHome" });
            }
        } else {
            console.log("A username and password must be present");
        }
    }
}
</script>

<style scoped>

</style>
