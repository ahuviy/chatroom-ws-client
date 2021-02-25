import { createStore } from "redux";

const initialState = {
  messages: [],
  name: "",
};

export const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      };
    case "SET_NAME":
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
});
