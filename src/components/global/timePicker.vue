<template lang="pug">
	v-menu(ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="time"
		transition="scale-transition" offset-y max-width="290px" min-width="290px")
		template(v-slot:activator="{ on, attrs }")
			v-text-field(dense v-model="time" label="" prepend-icon="mdi-clock-time-four-outline"
					readonly v-bind="attrs" v-on="on")
		v-time-picker(v-if="menu2" v-model="time" full-width @click:minute="$refs.menu.save(time)" format="ampm")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
	name: 'timePicker',
})

@Component
export default class timePicker extends Vue {
	private menu2: string = '';
	private time: string = '';
	@Prop() day!: string;
	@Prop() index!: string;
	@Prop() check!: string;
	private localDay: string = this.day
	private localIndex: string = this.index

	@Watch('time')
	watchTime(value: string, oldValue: string) {
		let data = {
			day: this.localDay,
			name: this.localIndex,
			time: this.time
		}
		if(this.check=='startTime') this.$store.commit('setStartTimeInstance', data)
		else if(this.check=='endTime') this.$store.commit('setEndTimeInstance', data)
		else this.$store.commit('setTime', data)
	}
  

}
</script>

<style scoped>

</style>