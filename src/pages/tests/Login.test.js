import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../Login";
import { loginUser } from "../../store/userSlice";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../store/userSlice", () => ({
  loginUser: jest.fn(() => ({ type: "LOGIN_USER" })),
}));

const mockStore = configureStore([]);

describe("LoginComponent", () => {
  let store;
  let navigate;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: null,
      },
    });

    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <LoginComponent />
      </Provider>
    );

  test("renders the login form correctly", () => {
    renderComponent();

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  test("dispatches loginUser action when form is submitted", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    expect(loginUser).toHaveBeenCalledWith({
      username: "testuser",
      password: "password",
    });
  });

  test("navigates to home page if user is authenticated", () => {
    store = mockStore({
      user: {
        user: { username: "testuser" },
      },
    });

    renderComponent();

    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("toggles password visibility when eye icon is clicked", () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole("button", { name: "" });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe("password");
  });
});
