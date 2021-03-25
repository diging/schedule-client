<template lang="pug">
    v-menu(ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="time"
        transition="scale-transition" offset-y max-width="290px" min-width="290px")
        template(v-slot:activator="{ on, attrs }")
            v-text-field(dense v-model="time" label="" prepend-icon="mdi-clock-time-four-outline"
                    readonly v-bind="attrs" v-on="on")
        v-time-picker(v-if="menu2" v-model="time" full-width @click:minute="$refs.menu.save(time)")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    name: 'timePicker',
})

export default class timePicker extends Vue{
    private menu2: string = '';

    @Prop() private time: string = '';
    @Prop() private day: string = '';
    @Prop() private index: string = '';

    public watchStoreForTime() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.timeValues;
		},
		(val) => {
		if (val) {
			// FIXME: This should set selected text to the actual text id
			this.time = val;
		} else {
			
		}
		},
		{
		deep: true,
		},
	);
  }

}
</script>

<style scoped>

</style>