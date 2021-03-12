<template lang="pug">
    v-card(class="pa-5 ma-auto" width="256")
        h2 Welcome.
        v-form(ref="form")
            v-text-field(v-model="username" label="Username" required)
            v-text-field(v-model="password" label="Password" required)
            v-btn(color="#F2594B" class="white--text" medium v-on:click="login()") Sign In

</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';

@Component({
	name: 'Signin',

})

export default class Signin extends Vue{
    private username: string='';
    private password: string='';

    setup() {
        
    }

    login() {
        if(this.username != "" && this.password != "") {
            if(this.username == "admin" && this.password == "admin") {
                this.$router.push({ name: "adminHome" });
            } else {
                console.log("The username and / or password is incorrect");
            }
        } else {
            console.log("A username and password must be present");
        }
    }
}
</script>

<style scoped>

</style>
