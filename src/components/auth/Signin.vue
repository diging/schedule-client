<template lang="pug">
    v-card(class="pa-10 ma-auto text-center" width="300")
        h2(class="mb-8") Welcome.
        v-form(ref="form")
            v-text-field(v-model="email" label="ASU Email" required)
            v-text-field(class="mb-5" v-model="password" label="Password" required)
            v-btn(color="#F2594B" class="white--text mb-5" medium @click="login()") Sign In
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

    login() {
        if(this.email != "" && this.password != "") {
            this.$axios.post('/token/', {
                email: this.email,
                password: this.password,
            })
            .then( (serializer) => {
                localStorage.setItem('access_token', serializer.data);
                if(this.email=='admin') {
                    this.$router.push({name: 'adminHome'});
                } else {
                    this.$router.push({name: 'userHome'});
                }
            })
            .catch(function (error: any) {
                console.log(error);
            })
        } else {
            console.log("A username and password must be present");
        }
    }
}
</script>

<style scoped>

</style>
