<template lang="pug">
    div(id="secure")
        h1 Secure Area
        p This is a secure area
        p {{ message }}
</template>

<script>
    export default {
        name: 'adminHomeView',
        data: { 
          message: "Welcome, Please Wait...."
        },
        methods:{
            callFunction: function () {
    
                var currentDate = new Date();
                console.log(currentDate);
    
                var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                console.log(currentDateWithFormat);
        
            }
        },
        mounted () {
            this.callFunction()
        }
        }
</script>

<style scoped>

</style>