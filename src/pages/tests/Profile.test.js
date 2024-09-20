import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Profile from "../Profile";
import { setUser } from "../../store/userSlice";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

const mockStore = configureStore([]);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../store/userSlice", () => ({
  setUser: jest.fn(() => ({ type: "SET_USER" })),
}));

describe("Profile Component", () => {
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

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

  test("dispatches setUser from localStorage when user is not in the state", () => {
    const mockStoredUser = {
      id: 1,
      firstName: "Stored",
      lastName: "User",
      username: "storeduser",
      email: "storeduser@example.com",
      gender: "Female",
      image: "https://via.placeholder.com/150",
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(mockStoredUser));

    renderComponent();

    // Check that setUser was called with the parsed user from localStorage
    expect(setUser).toHaveBeenCalledWith(mockStoredUser);
  });

  test("displays user profile when user data is available", () => {
    store = mockStore({
      user: {
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "johndoe@example.com",
          gender: "Male",
          image: "https://via.placeholder.com/150",
        },
      },
    });

    renderComponent();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
    expect(screen.getByText("johndoe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Gender: Male")).toBeInTheDocument();
  });

  test("shows message when user data is not available", () => {
    renderComponent();

    expect(
      screen.getByText(/No user data available. Please log in./i)
    ).toBeInTheDocument();
  });

  test("navigates to edit profile page when 'Edit Profile' button is clicked", () => {
    store = mockStore({
      user: {
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "johndoe@example.com",
          gender: "Male",
          image: "https://via.placeholder.com/150",
        },
      },
    });

    renderComponent();

    fireEvent.click(screen.getByText(/Edit Profile/i));

    expect(navigate).toHaveBeenCalledWith("/edit-profile/1");
  });
});
