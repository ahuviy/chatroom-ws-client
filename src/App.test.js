import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const submitBtnElement = screen.getByText("Submit");
  expect(submitBtnElement).toBeInTheDocument();
});
