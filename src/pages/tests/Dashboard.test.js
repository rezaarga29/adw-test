import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Dashboard from "../Dashboard";
import { BrowserRouter } from "react-router-dom";
import { fetchUsers, searchUsers } from "../../store/userSlice";

import "@testing-library/jest-dom";

jest.mock("../../store/userSlice", () => ({
  fetchUsers: jest.fn(() => ({ type: "FETCH_USERS" })),
  searchUsers: jest.fn(() => ({ type: "SEARCH_USERS" })),
}));

describe("Dashboard component", () => {
  const mockStore = configureStore();
  let store;

  const renderComponent = (initialState) =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

  beforeEach(() => {
    const initialState = {
      user: {
        users: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            role: "admin",
            email: "john@example.com",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Doe",
            username: "janedoe",
            role: "user",
            email: "jane@example.com",
            image: "https://via.placeholder.com/150",
          },
        ],
      },
    };

    store = mockStore(initialState);
  });

  test("renders the user dashboard title", () => {
    renderComponent();
    const titleElement = screen.getByText(/User Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders users in the dashboard", () => {
    renderComponent();
    const firstUser = screen.getByText(/John Doe/i);
    const secondUser = screen.getByText(/Jane Doe/i);

    expect(firstUser).toBeInTheDocument();
    expect(secondUser).toBeInTheDocument();
  });

  test("renders search input and button", () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search users.../i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test("handles search functionality", () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/Search users.../i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    fireEvent.change(searchInput, { target: { value: "john" } });
    expect(searchInput.value).toBe("john");

    fireEvent.click(searchButton);

    expect(searchUsers).toHaveBeenCalledWith("john");
  });

  test("handles search with empty input and dispatches fetchUsers", () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/Search users.../i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.click(searchButton);

    expect(fetchUsers).toHaveBeenCalledWith("firstName", "asc");
  });

  test("displays 'No users found...' when the users array is empty", () => {
    const emptyState = {
      user: {
        users: [],
      },
    };
    store = mockStore(emptyState);

    renderComponent();

    const noUsersMessage = screen.getByText(/No users found.../i);
    expect(noUsersMessage).toBeInTheDocument();
  });

  test("navigates to user details when 'View Details' button is clicked", () => {
    renderComponent();
    const viewDetailsButton = screen.getAllByText(/View Details/i)[0];

    fireEvent.click(viewDetailsButton);

    expect(window.location.pathname).toBe("/user/1");
  });

  test("handles sort by functionality", () => {
    renderComponent();

    const sortBySelect = screen.getByLabelText(/Sort By/i);
    const orderSelect = screen.getByLabelText(/Order/i);

    fireEvent.change(sortBySelect, { target: { value: "lastName" } });
    expect(sortBySelect.value).toBe("lastName");

    fireEvent.change(orderSelect, { target: { value: "desc" } });
    expect(orderSelect.value).toBe("desc");

    expect(fetchUsers).toHaveBeenCalledWith("lastName", "desc");
  });

  test("dispatches fetchUsers on initial render", () => {
    renderComponent();

    expect(fetchUsers).toHaveBeenCalledWith("firstName", "asc");
  });
});
