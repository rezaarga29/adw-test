import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AddUser from "../AddUser";
import { createUser } from "../../store/userSlice";
import "@testing-library/jest-dom";

jest.mock("../../store/userSlice", () => ({
  createUser: jest.fn(() => ({ type: "CREATE_USER" })),
}));

const mockStore = configureStore();
const store = mockStore({});

describe("AddUser Component", () => {
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <AddUser />
      </Provider>
    );

  test("renders the form correctly", () => {
    renderComponent();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add User/i })
    ).toBeInTheDocument();
  });

  test("shows validation messages when required fields are empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    expect(
      await screen.findByText(/First name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Age is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Gender is required/i)).toBeInTheDocument();
  });

  test("calls createUser action with correct data when form is submitted", async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.input(screen.getByLabelText(/Age/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: "male" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        age: "30",
        gender: "male",
      });
    });
  });
});
