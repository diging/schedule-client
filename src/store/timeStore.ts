import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex';
import { timePickerType, time } from '@/interfaces/timePickerTypes'
import { timeInstanceRootState } from '@/interfaces/GlobalTypes';

Vue.use(Vuex)

const initialState: timeInstanceRootState = {
    start_time: '00:00',
    end_time: '00:00',
  }


export default ({

  state: {
    initialState
  },
  mutations: {
    setStartTimeInstance(state: timeInstanceRootState,  timePickerType: timePickerType) {
        state.start_time = timePickerType['time'];
    },
    setEndTimeInstance(state: timeInstanceRootState,  timePickerType: timePickerType) {
        state.end_time = timePickerType['time'];
    }
  },
  getters: {
    timeInstance: (state: { start_time: string; end_time:string }) => {
      return state
    }
  },
  actions: {
  },
  modules: {
  }
})
