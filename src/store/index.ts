import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex';
import { timePickerType, schedule, time } from '@/interfaces/timePickerTypes'
import { RootState } from '@/interfaces/GlobalTypes'


Vue.use(Vuex)

const initialState: RootState = {
  schedule: {
    Monday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Tuesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Wednesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Thursday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Friday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'}
  }
}
const mutations: MutationTree<RootState> = {
setTime(state: RootState, timePickerValue: timePickerType ) {
	schedule['monday']['startTime1']
	state.schedule[timePickerValue['day']][timePickerValue['name'] as 'startTime1' | 'startTime2'| 'endTime1' | 'endTime2']
},
},

export default new Vuex.Store({

  state: initialState, 
  mutations,
  getters: {
    timeValues: state => {
      return state.schedule[].'startTime1', state.schedule[].startTime2, state.schedule[].endTime1, state.schedule[].'endTime2';
    }
  },
  actions: {
  },
  modules: {
  }
})
