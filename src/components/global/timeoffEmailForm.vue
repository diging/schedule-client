<template lang="pug">
v-form(ref="form" @submit.prevent="sendEmail()")
    label To Name
    v-text-field(
        type="text"
        v-model="localToName"
        name="to_name"
        placeholder="Your Name"
    )
    label From Name
    v-text-field(
        type="text"
        v-model="localFromName"
        name="from_name"
        placeholder="Your Name"
    )
    label Email
    v-text-field(
        type="email"
        v-model="localEmail"
        name="email"
        placeholder="Your Email"
    )
    label Message
    v-textarea(
        name="message"
        v-model="localMessage"
        cols="30"
        rows="5"
        placeholder="Message"
    )
        
    v-btn(type="submit" value="Send") Send
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import emailjs from 'emailjs-com'

@Component({
    name: 'timeoffEmailForm'
})

export default class timeoffEmailForm extends Vue{
    @Prop() toName!: string
    @Prop() fromName!: string
    @Prop() email!: string
    @Prop() message!: string

    private localToName: string = this.toName
    private localFromName: string = this.fromName
    private localEmail: string = this.email
    private localMessage: string = this.message
    
    @Watch('localToName')
    @Watch('localFromName')
    @Watch('localEmail')
    @Watch('localMessage')

    $refs!: {
        form: HTMLFormElement
    }

    mounted() {
        if(this.localToName != "" && this.localFromName != "" && this.localEmail != "" && this.localMessage != "") {
            this.sendEmail()
        }
    }

    sendEmail() {
        emailjs.sendForm('DigInG_Schedule', 'timeoff_request', this.$refs.form.$el,'Vt8qw-VWXJQZZd0Eg')
            .then((result) => {
                console.log('SUCCESS!', result.text)
            }, (error) => {
                console.log('FAILED...', error.text)
            })
    }
}
</script>

<style scoped>
* {box-sizing: border-box;}

.container {
  display: block;
  margin:auto;
  text-align: center;
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
  width: 50%;
}

label {
  float: left;
}

input[type=text], [type=email], textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}

input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #45a049;
}
</style>