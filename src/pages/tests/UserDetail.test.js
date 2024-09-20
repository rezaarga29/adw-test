import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserDetailComponent from "../UserDetail";
import "@testing-library/jest-dom";
import { fetchUserDetail } from "../../store/userSlice";

jest.mock("../../store/userSlice", () => ({
  fetchUserDetail: jest.fn(() => ({
    type: "user/fetchUserDetail",
    payload: {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
      age: 30,
      gender: "Male",
    },
  })),
}));

const mockStore = configureStore([]);

describe("UserDetailComponent", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userDetail: null,
      },
    });
  });

  it("shows loading message when user details are being fetched", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:id" element={<UserDetailComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading user details...")).toBeInTheDocument();
  });

  it("displays user details when userDetail data is available", () => {
    store = mockStore({
      user: {
        userDetail: {
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          age: 30,
          gender: "Male",
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:id" element={<UserDetailComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Gender: Male")).toBeInTheDocument();
    expect(screen.getByText("Age: 30")).toBeInTheDocument();
  });

  it("calls fetchUserDetail on component mount", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:id" element={<UserDetailComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(fetchUserDetail).toHaveBeenCalledWith("1");
  });
});
