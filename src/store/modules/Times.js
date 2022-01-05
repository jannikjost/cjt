import { v4 } from "uuid";

const moduleTimes = {
  state: () => ({
    //time: {id, startTime, stopTime, time}
    times: [],
  }),
  getters: {
    getTimeById: (state) => (timeId) => {
      return state.times.find((el) => el.id === timeId);
    },
  },
  mutations: {
    addTime(state, id) {
      state.times.push({ id, startTime: "", stopTime: "", time: 0 });
    },
    setStartTime(state, props) {
      state.times.forEach((element) => {
        if (element.id === props.id) {
          element.startTime = props.startTime;
        }
      });
    },
  },
  actions: {
    addNewTime(context) {
      return new Promise((resolve, reject) => {
        const id = v4();
        context.commit("addTime", id);
        //TODO sync with db
        resolve(id);
        reject();
      });
    },
    setStartTime(context, props) {
      context.commit("setStartTime", props);
      //TODO sync with db
    },
  },
};

export default moduleTimes;
