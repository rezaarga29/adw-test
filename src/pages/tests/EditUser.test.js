import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useNavigate, useParams } from "react-router-dom";
import EditUser from "../EditUser";
import { fetchUserDetail, updateUser } from "../../store/userSlice";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../../store/userSlice", () => ({
  fetchUserDetail: jest.fn(() => ({
    type: "user/fetchUserDetail",
    payload: {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      gender: "male",
    },
  })),
  updateUser: jest.fn(() => ({
    type: "user/updateUser",
    payload: {
      firstName: "Jane",
      lastName: "Smith",
      age: 35,
      gender: "female",
    },
  })),
}));

const mockStore = configureStore();
const store = mockStore({
  user: {
    userDetail: {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      gender: "male",
    },
  },
});

describe("EditUser Component", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ id: "1" });
    useNavigate.mockReturnValue(navigate);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <EditUser />
      </Provider>
    );

  test("renders the form with pre-filled user data", async () => {
    renderComponent();

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("John");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Doe");
    expect(screen.getByLabelText(/Age/i)).toHaveValue(30);
    expect(screen.getByLabelText(/Gender/i)).toHaveValue("male");
  });

  test("shows validation messages when required fields are empty", async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: "" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: "" },
    });
    fireEvent.input(screen.getByLabelText(/Age/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update User/i }));

    expect(
      await screen.findByText(/First name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Age is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Gender is required/i)).toBeInTheDocument(); // Updated this line
  });

  test("calls updateUser action with correct data when form is submitted", async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: "Smith" },
    });
    fireEvent.input(screen.getByLabelText(/Age/i), {
      target: { value: "35" },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: "female" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update User/i }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith("1", {
        firstName: "Jane",
        lastName: "Smith",
        age: "35",
        gender: "female",
      });
    });

    expect(navigate).toHaveBeenCalledWith("/profile");
  });
});
