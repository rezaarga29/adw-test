import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Swal from "sweetalert2";
import {
  setUser,
  setUsers,
  setUserDetail,
  addUser,
  updateUserInState,
  fetchUsers,
  fetchUserDetail,
  searchUsers,
  createUser,
  updateUser,
  loginUser,
} from "../../store/userSlice";

jest.mock("sweetalert2");

describe("userSlice async actions", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);

    Object.defineProperty(global, "localStorage", {
      value: {
        setItem: jest.fn(),
        removeItem: jest.fn(),
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("should successfully log in a user", async () => {
    const credentials = { username: "testuser", password: "password" };
    const userData = {
      id: 1,
      username: "testuser",
      token: "12345",
      refreshToken: "54321",
    };

    mockAxios.onPost("https://dummyjson.com/auth/login").reply(200, userData);

    const dispatch = jest.fn();

    await loginUser(credentials)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setUser(userData));
    expect(localStorage.setItem).toHaveBeenCalledWith("token", userData.token);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      userData.refreshToken
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(userData)
    );
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Successful!",
      text: `Welcome ${userData.username}`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  });

  it("should show error when login fails", async () => {
    const credentials = { username: "wronguser", password: "wrongpass" };

    mockAxios
      .onPost("https://dummyjson.com/auth/login")
      .reply(400, { message: "Invalid credentials" });

    const dispatch = jest.fn();

    await loginUser(credentials)(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Failed!",
      text: "Invalid credentials",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  it("should fetch users and dispatch setUsers", async () => {
    const users = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ];

    mockAxios
      .onGet("https://dummyjson.com/users?sortBy=firstName&order=asc")
      .reply(200, { users });

    const dispatch = jest.fn();

    await fetchUsers()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setUsers(users));
  });

  it("should handle error during fetchUsers", async () => {
    mockAxios
      .onGet("https://dummyjson.com/users?sortBy=firstName&order=asc")
      .reply(500);

    const dispatch = jest.fn();

    await fetchUsers()(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Error!",
      text: "An error occurred while fetching users",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  it("should fetch user detail and dispatch setUserDetail", async () => {
    const userDetail = { id: 1, username: "user1" };

    mockAxios.onGet("https://dummyjson.com/users/1").reply(200, userDetail);

    const dispatch = jest.fn();

    await fetchUserDetail(1)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setUserDetail(userDetail));
  });

  it("should handle error during fetchUserDetail", async () => {
    mockAxios.onGet("https://dummyjson.com/users/1").reply(500);

    const dispatch = jest.fn();

    await fetchUserDetail(1)(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Error!",
      text: "An error occurred while fetching user details",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  it("should search users and dispatch setUsers", async () => {
    const users = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ];

    mockAxios
      .onGet("https://dummyjson.com/users/search?q=test")
      .reply(200, { users });

    const dispatch = jest.fn();

    await searchUsers("test")(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setUsers(users));
  });

  it("should handle error during searchUsers", async () => {
    mockAxios.onGet("https://dummyjson.com/users/search?q=test").reply(500);

    const dispatch = jest.fn();

    await searchUsers("test")(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Error!",
      text: "An error occurred while searching users",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  it("should create a user and dispatch addUser", async () => {
    const newUser = { firstName: "John", lastName: "Doe" };
    const responseUser = { id: 3, ...newUser };

    mockAxios
      .onPost("https://dummyjson.com/users/add")
      .reply(200, responseUser);

    const dispatch = jest.fn();

    await createUser(newUser)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(addUser(responseUser));
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "User Added Successfully!",
      text: `User John Doe has been added.`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  });

  it("should handle error during createUser", async () => {
    const newUser = { firstName: "John", lastName: "Doe" };

    mockAxios.onPost("https://dummyjson.com/users/add").reply(500);

    const dispatch = jest.fn();

    await createUser(newUser)(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Error!",
      text: "An error occurred while adding user",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  it("should update a user and dispatch updateUserInState", async () => {
    const updatedUser = { id: 1, firstName: "John", lastName: "Smith" };

    mockAxios.onPut("https://dummyjson.com/users/1").reply(200, updatedUser);

    const dispatch = jest.fn();

    await updateUser(1, updatedUser)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(updateUserInState(updatedUser));
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "User Updated Successfully!",
      text: `User John Smith has been updated.`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  });

  it("should handle error during updateUser", async () => {
    const updatedUser = { id: 1, firstName: "John", lastName: "Smith" };

    mockAxios.onPut("https://dummyjson.com/users/1").reply(500);

    const dispatch = jest.fn();

    await updateUser(1, updatedUser)(dispatch);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Error!",
      text: "An error occurred while updating user",
      icon: "error",
      confirmButtonText: "Ok",
    });
  });
});
